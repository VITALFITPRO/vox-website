-- ============================================================
-- VOX SDK — MIGRACIÓN COMPLETA DE BASE DE DATOS
-- Ejecutar en Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ===== TABLA: purchases (compras) =====
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  mercadopago_payment_id TEXT UNIQUE,
  mercadopago_status TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== TABLA: download_tokens (tokens de descarga) =====
CREATE TABLE IF NOT EXISTS download_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  max_downloads INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== TABLA: downloads (registro de descargas) =====
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_id UUID REFERENCES download_tokens(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('windows', 'mac', 'linux')),
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para búsqueda rápida por token + IP
CREATE INDEX IF NOT EXISTS idx_downloads_token_ip ON downloads(token_id, ip_address);

-- Evitar que la misma IP descargue la misma plataforma con el mismo token
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_download ON downloads(token_id, ip_address, platform);

-- ===== TABLA: licenses (licencias) =====
CREATE TABLE IF NOT EXISTS licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  hardware_id TEXT,
  activated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== ROW LEVEL SECURITY =====
-- Activar RLS en todas las tablas para que el frontend (anon key) 
-- NO pueda acceder directamente. Solo las Edge Functions (service_role) pueden.
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- ===== FUNCIÓN: generar license_key formato VOX-XXXX-XXXX-XXXX =====
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'VOX-';
  i INT;
  g INT;
BEGIN
  FOR g IN 1..3 LOOP
    FOR i IN 1..4 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    IF g < 3 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
