// @ts-nocheck
// ============================================================
// EDGE FUNCTION: verify-license
// Verificación en cada inicio del ejecutable Vox.
// Comprueba que la licencia sea válida y esté vinculada al hardware.
//
// Endpoint: POST /functions/v1/verify-license
// Body: { license_key, hardware_id }
// Response (OK):    { valid: true, license_key: string }
// Response (Error): { valid: false, error: string, code: string }
//
// Códigos de error:
//   MISSING_PARAMS     — Faltan campos requeridos
//   INVALID_LICENSE    — Licencia no existe
//   LICENSE_DISABLED   — Licencia revocada manualmente
//   NOT_ACTIVATED      — Licencia nunca activada (sin hardware_id)
//   HARDWARE_MISMATCH  — El hardware_id no coincide con el registrado
//   RATE_LIMIT_EXCEEDED — Demasiadas verificaciones seguidas
//
// SECRETS necesarios:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit } from '../_shared/rate_limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { license_key, hardware_id } = await req.json();

    if (!license_key || !hardware_id) {
      return new Response(
        JSON.stringify({ valid: false, error: 'license_key y hardware_id son requeridos', code: 'MISSING_PARAMS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING (más permisivo que activación: 60 req/min) ---
    const rateStatus = await checkRateLimit(req, supabase, 'verify-license');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Demasiadas verificaciones seguidas.', code: 'RATE_LIMIT_EXCEEDED' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Buscar la licencia por license_key
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('id, hardware_id, is_active')
      .eq('license_key', license_key)
      .single();

    if (licenseError || !license) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Licencia no encontrada', code: 'INVALID_LICENSE' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verificar que no haya sido revocada
    if (!license.is_active) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Esta licencia ha sido revocada', code: 'LICENSE_DISABLED' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verificar que la licencia esté activada (tenga hardware_id)
    if (!license.hardware_id) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Esta licencia no ha sido activada en ningún equipo', code: 'NOT_ACTIVATED' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verificar que el hardware_id coincida
    if (license.hardware_id !== hardware_id) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Esta licencia está registrada en otro equipo', code: 'HARDWARE_MISMATCH' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Todo válido — registrar el evento de verificación
    await supabase
      .from('license_checks')
      .insert({
        license_id: license.id,
        hardware_id: hardware_id,
        ip_address: req.headers.get('x-forwarded-for') ?? req.headers.get('cf-connecting-ip') ?? 'unknown',
      });

    return new Response(
      JSON.stringify({ valid: true, license_key }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Error interno del servidor', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
