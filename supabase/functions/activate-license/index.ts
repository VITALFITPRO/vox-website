// @ts-nocheck
// ============================================================
// EDGE FUNCTION: activate-license
// Activa una licencia vinculándola al hardware_id del equipo
//
// Endpoint: POST /functions/v1/activate-license
// Body: { license_key, hardware_id }
// Response (OK): { activated: true, license_key: string }
// Response (Error): { error: string, code: string }
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
        JSON.stringify({ error: 'license_key y hardware_id son requeridos', code: 'MISSING_PARAMS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING ---
    const rateStatus = await checkRateLimit(req, supabase, 'activate-license');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas activaciones seguidas. Bloqueo Anti-DDoS.', code: 'RATE_LIMIT_EXCEEDED' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Buscar la licencia
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('id, hardware_id, is_active, activated_at')
      .eq('license_key', license_key)
      .single();

    if (licenseError || !license) {
      return new Response(
        JSON.stringify({ error: 'Licencia no encontrada', code: 'INVALID_LICENSE' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verificar si está activa
    if (!license.is_active) {
      return new Response(
        JSON.stringify({ error: 'Esta licencia ha sido desactivada', code: 'LICENSE_DISABLED' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Si ya tiene hardware_id, verificar que coincida
    if (license.hardware_id && license.hardware_id !== hardware_id) {
      return new Response(
        JSON.stringify({
          error: 'Esta licencia ya está activada en otro equipo',
          code: 'HARDWARE_MISMATCH',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Si es primera activación, asignar hardware_id
    if (!license.hardware_id) {
      const { error: updateError } = await supabase
        .from('licenses')
        .update({
          hardware_id,
          activated_at: new Date().toISOString(),
        })
        .eq('id', license.id);

      if (updateError) {
        console.error('Error activando licencia:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error al activar licencia', code: 'UPDATE_ERROR' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 5. Licencia válida y activada
    return new Response(
      JSON.stringify({
        activated: true,
        license_key,
        first_activation: !license.hardware_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor', code: 'INTERNAL_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
