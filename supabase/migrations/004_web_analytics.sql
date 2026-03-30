-- Migración para Web Analytics
CREATE TABLE IF NOT EXISTS public.web_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ruta TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    session_id UUID NOT NULL,
    pais TEXT,
    dispositivo TEXT
);

-- Indice para reportes rápidos por ruta o fecha
CREATE INDEX IF NOT EXISTS idx_web_analytics_fecha ON public.web_analytics(fecha);
CREATE INDEX IF NOT EXISTS idx_web_analytics_ruta ON public.web_analytics(ruta);

-- Opcional: Permitir inserciones a roles anónimos (si RLS está habilitado)
ALTER TABLE public.web_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON public.web_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow read for auth users" ON public.web_analytics FOR SELECT TO authenticated USING (true);
