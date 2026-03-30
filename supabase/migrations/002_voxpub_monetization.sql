-- ==============================================================================
-- VOXPUB - TABLAS DE MONETIZACIÓN (REPARTO 50% POR VISTAS ADSENSE)
-- ==============================================================================

-- 1. Tabla de Desarrolladores Registrados en VoxPub (Vinculados a Mercado Pago)
CREATE TABLE IF NOT EXISTS public.developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    mercadopago_wallet_id TEXT, -- ID Opcional donde recibe el dinero mensual
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla del Catálogo de Librerías (Paquetes)
CREATE TABLE IF NOT EXISTS public.vox_libraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    nombre_paquete TEXT UNIQUE NOT NULL, -- ej: "firebase_auth_latino"
    version_actual TEXT DEFAULT '1.0.0',
    descripcion TEXT,
    url_descarga TEXT, -- Opcional si se baja de tu Storage
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Rastreo de Vistas Únicas para las Páginas de Documentación
CREATE TABLE IF NOT EXISTS public.library_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    library_id UUID NOT NULL REFERENCES public.vox_libraries(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Para evitar que granjas de bots o un desarrollador dándole F5 inflen sus números,
-- solo contamos 1 visita por IP por cada hora (o por día) usando un Unique Constraint condicional:
-- (Aquí simplemente delegaremos el control de frecuencia a las Edge Functions,
-- pero para asegurar integridad de base de datos añadimos un índice):
CREATE INDEX idx_library_views_ip ON public.library_page_views (library_id, ip_address);

-- ==============================================================================
-- REGLAS RLS (Row Level Security)
-- ==============================================================================

ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vox_libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_page_views ENABLE ROW LEVEL SECURITY;

-- Solo el Backend (Edge Functions de Supabase) puede escribir en estas tablas 
-- mediante service_role. El público solo tiene acceso de lectura.

CREATE POLICY "Lectura publica de librerias" ON public.vox_libraries 
    FOR SELECT TO public USING (true);

-- ==============================================================================
-- FUNCIÓN SQL: CALCULAR VISTAS MENSUALES (Para Pago 50/50)
-- ==============================================================================
-- Puedes llamar a esta RPC desde una Edge Function "payout-scheduler" a fin de mes.
CREATE OR REPLACE FUNCTION get_monthly_views_for_payout(mes INT, anio INT)
RETURNS TABLE (
    developer_email TEXT,
    mercadopago_wallet TEXT,
    library_name TEXT,
    total_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
      d.email,
      d.mercadopago_wallet_id,
      l.nombre_paquete,
      COUNT(v.id) AS total_views
  FROM 
      public.developers d
  JOIN 
      public.vox_libraries l ON d.id = l.developer_id
  JOIN 
      public.library_page_views v ON l.id = v.library_id
  WHERE 
      EXTRACT(MONTH FROM v.viewed_at) = mes AND
      EXTRACT(YEAR FROM v.viewed_at) = anio
  GROUP BY 
      d.id, l.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
