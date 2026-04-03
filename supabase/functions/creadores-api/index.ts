// @ts-nocheck
// ============================================================
// EDGE FUNCTION: creadores-api
// API para el dashboard de creadores (datos reales).
//
// Endpoint: POST /functions/v1/creadores-api
// Body: { action, email, ...params }
// Auth: El usuario debe estar autenticado vía Supabase Auth
//
// Actions:
//   "my_libraries"   → Mis librerías + stats
//   "my_earnings"    → Balance disponible y historial
//   "request_payout" → Solicitar retiro
//   "register_dev"   → Registrarse como developer
//
// SECRETS: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING ---
    const rateStatus = await checkRateLimit(req, supabase, 'creadores-api');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Intenta en 15 minutos.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, email, ...params } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'email es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const json = (data, status = 200) => new Response(
      JSON.stringify(data),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    // ─── REGISTER DEVELOPER ─────────────────
    if (action === 'register_dev') {
      const { nombre, mercadopago_wallet_id } = params;

      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('developers')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return json({ success: true, message: 'Ya estás registrado como desarrollador', developer_id: existing.id });
      }

      const { data: newDev, error } = await supabase
        .from('developers')
        .insert({ email, nombre: nombre || email.split('@')[0], mercadopago_wallet_id: mercadopago_wallet_id || null })
        .select('id')
        .single();

      if (error) return json({ error: 'Error registrando desarrollador' }, 500);
      return json({ success: true, developer_id: newDev.id });
    }

    // ─── MY LIBRARIES ───────────────────────
    if (action === 'my_libraries') {
      // Buscar developer
      const { data: dev } = await supabase
        .from('developers')
        .select('id')
        .eq('email', email)
        .single();

      if (!dev) return json({ libraries: [], message: 'No estás registrado como desarrollador' });

      const { data: libs, error } = await supabase
        .from('vox_libraries')
        .select('id, nombre_paquete, version_actual, descripcion, downloads_count, created_at')
        .eq('developer_id', dev.id)
        .order('created_at', { ascending: false });

      if (error) return json({ error: error.message }, 500);

      // Enriquecer con vistas del mes
      const enriched = [];
      for (const lib of (libs || [])) {
        const { count: viewsThisMonth } = await supabase
          .from('library_page_views')
          .select('id', { count: 'exact', head: true })
          .eq('library_id', lib.id)
          .gte('viewed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        enriched.push({
          ...lib,
          views_this_month: viewsThisMonth || 0,
        });
      }

      return json({ libraries: enriched });
    }

    // ─── MY EARNINGS ────────────────────────
    if (action === 'my_earnings') {
      const { data: dev } = await supabase
        .from('developers')
        .select('id')
        .eq('email', email)
        .single();

      if (!dev) return json({ balance: 0, history: [] });

      // Obtener vistas totales del mes actual para calcular earnings
      const { data: libs } = await supabase
        .from('vox_libraries')
        .select('id')
        .eq('developer_id', dev.id);

      let totalViewsMonth = 0;
      for (const lib of (libs || [])) {
        const { count } = await supabase
          .from('library_page_views')
          .select('id', { count: 'exact', head: true })
          .eq('library_id', lib.id)
          .gte('viewed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
        totalViewsMonth += (count || 0);
      }

      // Calcular balance: $0.001 por vista × 50% = $0.0005 por vista para el creador
      const earningsPerView = 0.0005;
      const currentBalance = totalViewsMonth * earningsPerView;

      // Historial de pagos
      const { data: payouts } = await supabase
        .from('payout_requests')
        .select('id, monto, estado, created_at, processed_at')
        .eq('developer_id', dev.id)
        .order('created_at', { ascending: false });

      // Restar pagos ya realizados del balance
      const paidTotal = (payouts || [])
        .filter(p => p.estado === 'pagado')
        .reduce((sum, p) => sum + Number(p.monto), 0);

      return json({
        balance: Math.max(0, currentBalance - paidTotal),
        views_this_month: totalViewsMonth,
        history: payouts || [],
      });
    }

    // ─── REQUEST PAYOUT ─────────────────────
    if (action === 'request_payout') {
      const { monto } = params;

      const { data: dev } = await supabase
        .from('developers')
        .select('id, mercadopago_wallet_id')
        .eq('email', email)
        .single();

      if (!dev) return json({ error: 'No estás registrado como desarrollador' }, 403);

      if (!monto || monto < 20) {
        return json({ error: 'El monto mínimo para solicitar un retiro es S/. 20.00' }, 400);
      }

      // Verificar que no tenga un pago pendiente
      const { data: pending } = await supabase
        .from('payout_requests')
        .select('id')
        .eq('developer_id', dev.id)
        .eq('estado', 'pendiente')
        .limit(1);

      if (pending && pending.length > 0) {
        return json({ error: 'Ya tienes una solicitud de pago pendiente' }, 400);
      }

      const { error } = await supabase
        .from('payout_requests')
        .insert({
          developer_id: dev.id,
          monto: monto,
          mercadopago_wallet_id: dev.mercadopago_wallet_id,
        });

      if (error) return json({ error: 'Error creando solicitud de pago' }, 500);
      return json({ success: true, message: 'Solicitud de pago creada. Se procesará en 48h.' });
    }

    return json({ error: `Acción desconocida: ${action}` }, 400);

  } catch (err) {
    console.error('creadores-api error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
