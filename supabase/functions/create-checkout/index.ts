// @ts-nocheck
// ============================================================
// EDGE FUNCTION: create-checkout
// Crea una preferencia de pago en Mercado Pago y devuelve la URL de checkout
// 
// Endpoint: POST /functions/v1/create-checkout
// Body: { email, name, phone }
// Response: { checkout_url: string }
//
// SECRETS necesarios en Supabase Dashboard → Edge Functions → Secrets:
//   - MERCADOPAGO_ACCESS_TOKEN
//   - SITE_URL (ej: https://voxlang.com)
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, name, phone } = await req.json();

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Email y nombre son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://voxlang.com';
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING ---
    const rateStatus = await checkRateLimit(req, supabase, 'create-checkout');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas peticiones de compra continuas. Bloqueo Anti-DDoS.', code: 'RATE_LIMIT_EXCEEDED' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Crear preferencia de pago en Mercado Pago
    const preference = {
      items: [
        {
          title: 'Vox SDK — Licencia completa',
          description: 'Compilador Vox completo. Genera Flutter/Dart. Android + iOS + Web.',
          quantity: 1,
          currency_id: 'USD',
          unit_price: 1,
        },
      ],
      payer: {
        email,
        name,
      },
      back_urls: {
        success: `${SITE_URL}/compra-exitosa`,
        failure: `${SITE_URL}/#pricing`,
        pending: `${SITE_URL}/compra-pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
      external_reference: JSON.stringify({ email, name, phone }),
      statement_descriptor: 'VOX SDK',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      const mpError = await mpResponse.text();
      console.error('Mercado Pago error:', mpError);
      return new Response(
        JSON.stringify({ error: 'Error al crear preferencia de pago' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mpData = await mpResponse.json();

    return new Response(
      JSON.stringify({
        checkout_url: mpData.init_point,
        sandbox_url: mpData.sandbox_init_point,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
