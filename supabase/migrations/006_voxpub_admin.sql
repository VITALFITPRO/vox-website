-- ============================================================
-- MIGRACIÓN 006: Mejoras VoxPub + tabla admin
-- - Columna autor_email en vox_libraries (publicar-libreria la usa)
-- - Columna downloads_count en vox_libraries 
-- - Tabla admin_users para panel de administración
-- - Tabla payout_requests para retiros de creadores
-- ============================================================

-- 1. Añadir autor_email a vox_libraries (la Edge Function lo necesita)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vox_libraries' AND column_name = 'autor_email'
  ) THEN
    ALTER TABLE public.vox_libraries ADD COLUMN autor_email TEXT;
  END IF;
END $$;

-- 2. Añadir downloads_count para tracking rápido
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vox_libraries' AND column_name = 'downloads_count'
  ) THEN
    ALTER TABLE public.vox_libraries ADD COLUMN downloads_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- 3. Tabla de administradores (login con email/password hasheado)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- bcrypt hash
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Tabla de solicitudes de pago de creadores
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'rechazado')),
  mercadopago_wallet_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- Índice para consultas de pagos por developer
CREATE INDEX IF NOT EXISTS idx_payout_requests_dev ON public.payout_requests(developer_id);

-- 5. Función para contar descargas de una librería (por vistas de página)
CREATE OR REPLACE FUNCTION get_library_stats(dev_email TEXT)
RETURNS TABLE (
  library_id UUID,
  nombre_paquete TEXT,
  version_actual TEXT,
  descripcion TEXT,
  downloads_count INTEGER,
  views_this_month BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.nombre_paquete,
    l.version_actual,
    l.descripcion,
    l.downloads_count,
    COALESCE(
      (SELECT COUNT(*) FROM public.library_page_views v 
       WHERE v.library_id = l.id 
       AND v.viewed_at >= date_trunc('month', CURRENT_TIMESTAMP)),
      0
    )::BIGINT AS views_this_month
  FROM public.vox_libraries l
  JOIN public.developers d ON l.developer_id = d.id
  WHERE d.email = dev_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para obtener resumen admin
CREATE OR REPLACE FUNCTION get_admin_summary()
RETURNS TABLE (
  total_purchases BIGINT,
  total_revenue DECIMAL,
  total_licenses BIGINT,
  active_licenses BIGINT,
  total_libraries BIGINT,
  total_developers BIGINT,
  total_downloads BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM purchases)::BIGINT,
    COALESCE((SELECT SUM(amount) FROM purchases WHERE status = 'approved'), 0)::DECIMAL,
    (SELECT COUNT(*) FROM licenses)::BIGINT,
    (SELECT COUNT(*) FROM licenses WHERE is_active = true)::BIGINT,
    (SELECT COUNT(*) FROM vox_libraries)::BIGINT,
    (SELECT COUNT(*) FROM developers)::BIGINT,
    COALESCE((SELECT SUM(downloads_count) FROM vox_libraries), 0)::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
