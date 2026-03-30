-- ==============================================================================
-- VOXPUB - SEGURIDAD RATE LIMITER ANTI-DDoS (100 req / 15 min)
-- ==============================================================================

-- 1. Tabla de Logs de Rate Limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip INET NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índice Compuesto para búsquedas ultra-rápidas por IP, Endpoint y Tiempo
CREATE INDEX IF NOT EXISTS idx_rate_limit_perf 
ON public.rate_limit_logs (ip, endpoint, window_start);

-- ==============================================================================
-- REGLAS RLS (Row Level Security)
-- ==============================================================================

ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- Esta tabla es exclusivamante de sistema. El público (anon / authenticated) no tiene 
-- ningún permiso de SELECT, INSERT, UPDATE, o DELETE. 
-- Solo las Edge Functions (con service_role_key) pueden interactuar con ella.

-- ==============================================================================
-- PROCESO DE LIMPIEZA AUTOMÁTICA (Cron / Trigger Cleanup)
-- ==============================================================================
-- Para que la tabla no crezca indefinidamente, podríamos crear una RPC de limpieza
-- para que elimine los logs que tienen más de 1 hora de antigüedad.

CREATE OR REPLACE FUNCTION clean_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM public.rate_limit_logs
    WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
