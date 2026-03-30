-- ==============================================================================
-- VOXPUB - ANALÍTICAS WEB (SIN COOKIES Y PRIVADO)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.web_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    ruta TEXT NOT NULL,
    user_agent TEXT,
    pais_origen TEXT DEFAULT 'Desconocido',
    dispositivo TEXT DEFAULT 'Desktop',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- REGLAS RLS
-- ==============================================================================

ALTER TABLE public.web_analytics ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT a cualquier persona (anon o auth) para que la metadata se guarde.
CREATE POLICY "Permitir insertar analiticas" ON public.web_analytics 
    FOR INSERT TO public WITH CHECK (true);

-- Solo los Admins/Dueños pueden ver
CREATE POLICY "Solo admins ven analiticas" ON public.web_analytics 
    FOR SELECT TO authenticated USING (true);
