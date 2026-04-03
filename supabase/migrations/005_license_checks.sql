-- ============================================================
-- MIGRACIÓN 005: tabla license_checks
-- Registra cada verificación de licencia por el ejecutable Vox.
-- Útil para auditoría, detección de piratería y revocación.
-- ============================================================

CREATE TABLE IF NOT EXISTS license_checks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id  UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  hardware_id TEXT NOT NULL,
  ip_address  TEXT,
  checked_at  TIMESTAMPTZ DEFAULT now()
);

-- Índice para consultas por licencia (ver historial de uso)
CREATE INDEX idx_license_checks_license_id ON license_checks(license_id);

-- Índice para detectar un mismo hardware_id con múltiples licencias
CREATE INDEX idx_license_checks_hardware_id ON license_checks(hardware_id);

-- RLS: solo service_role puede leer/escribir
ALTER TABLE license_checks ENABLE ROW LEVEL SECURITY;
