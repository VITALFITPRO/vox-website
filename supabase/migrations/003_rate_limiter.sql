-- Migración para Rate Limiter Anti-DDoS
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
    ip TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ip, endpoint, window_start)
);

-- Indice para limpieza y consultas rápidas
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON public.rate_limit_logs(window_start);

-- Función RPC para incrementar contador y validar (Retorna TRUE si está dentro de límite)
CREATE OR REPLACE FUNCTION check_rate_limit(client_ip TEXT, api_endpoint TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_window TIMESTAMP WITH TIME ZONE;
    current_count INT;
BEGIN
    current_window := date_trunc('minute', CURRENT_TIMESTAMP) - (cast(extract(minute from CURRENT_TIMESTAMP) as int) % 15) * interval '1 minute';
    
    INSERT INTO public.rate_limit_logs (ip, endpoint, request_count, window_start)
    VALUES (client_ip, api_endpoint, 1, current_window)
    ON CONFLICT (ip, endpoint, window_start)
    DO UPDATE SET request_count = public.rate_limit_logs.request_count + 1
    RETURNING request_count INTO current_count;
    
    IF current_count > 100 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;
