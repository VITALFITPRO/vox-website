// @ts-nocheck
// ============================================================
// EDGE FUNCTION: admin-dashboard
// API del panel de administración. Protegida por contraseña admin.
//
// Endpoint: POST /functions/v1/admin-dashboard
// Body: { action, admin_key, ...params }
//
// Actions:
//   "summary"    → Resumen general (totales)
//   "purchases"  → Lista de compras
//   "licenses"   → Lista de licencias (con opción de revocar)
//   "revoke"     → Revocar una licencia { license_id }
//   "libraries"  → Lista de librerías publicadas
//   "developers" → Lista de desarrolladores
//   "analytics"  → Datos de web_analytics recientes
//   "payouts"    → Solicitudes de pago
//   "payout_approve" → Aprobar un pago { payout_id }
//
// SECRETS necesarios:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
//   - ADMIN_SECRET_KEY (contraseña del admin)
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
    const ADMIN_SECRET_KEY = Deno.env.get('ADMIN_SECRET_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING ---
    const rateStatus = await checkRateLimit(req, supabase, 'admin-dashboard');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, admin_key, ...params } = await req.json();

    // --- AUTENTICACIÓN ADMIN ---
    if (!admin_key || admin_key !== ADMIN_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Acceso no autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const json = (data, status = 200) => new Response(
      JSON.stringify(data),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    // ─── SUMMARY ─────────────────────────────
    if (action === 'summary') {
      const [purchases, licenses, libraries, developers, analytics] = await Promise.all([
        supabase.from('purchases').select('id, amount, status', { count: 'exact' }),
        supabase.from('licenses').select('id, is_active', { count: 'exact' }),
        supabase.from('vox_libraries').select('id', { count: 'exact' }),
        supabase.from('developers').select('id', { count: 'exact' }),
        supabase.from('web_analytics').select('id', { count: 'exact' }),
      ]);

      const approvedPurchases = (purchases.data || []).filter(p => p.status === 'approved');
      const totalRevenue = approvedPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
      const activeLicenses = (licenses.data || []).filter(l => l.is_active).length;

      return json({
        total_purchases: purchases.count || 0,
        total_revenue: totalRevenue,
        total_licenses: licenses.count || 0,
        active_licenses: activeLicenses,
        total_libraries: libraries.count || 0,
        total_developers: developers.count || 0,
        total_pageviews: analytics.count || 0,
      });
    }

    // ─── PURCHASES ───────────────────────────
    if (action === 'purchases') {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ purchases: data });
    }

    // ─── LICENSES ────────────────────────────
    if (action === 'licenses') {
      const { data, error } = await supabase
        .from('licenses')
        .select('id, license_key, hardware_id, is_active, activated_at, created_at, purchase_id')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ licenses: data });
    }

    // ─── REVOKE LICENSE ──────────────────────
    if (action === 'revoke') {
      const { license_id } = params;
      if (!license_id) return json({ error: 'license_id requerido' }, 400);

      const { error } = await supabase
        .from('licenses')
        .update({ is_active: false })
        .eq('id', license_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, message: 'Licencia revocada' });
    }

    // ─── REACTIVATE LICENSE ──────────────────
    if (action === 'reactivate') {
      const { license_id } = params;
      if (!license_id) return json({ error: 'license_id requerido' }, 400);

      const { error } = await supabase
        .from('licenses')
        .update({ is_active: true })
        .eq('id', license_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, message: 'Licencia reactivada' });
    }

    // ─── RESET HARDWARE (permite migrar a otro PC) ──
    if (action === 'reset_hardware') {
      const { license_id } = params;
      if (!license_id) return json({ error: 'license_id requerido' }, 400);

      const { error } = await supabase
        .from('licenses')
        .update({ hardware_id: null, activated_at: null })
        .eq('id', license_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, message: 'Hardware reset — licencia puede activarse en nuevo equipo' });
    }

    // ─── LIBRARIES ───────────────────────────
    if (action === 'libraries') {
      const { data, error } = await supabase
        .from('vox_libraries')
        .select('id, nombre_paquete, version_actual, descripcion, autor_email, downloads_count, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ libraries: data });
    }

    // ─── DEVELOPERS ──────────────────────────
    if (action === 'developers') {
      const { data, error } = await supabase
        .from('developers')
        .select('id, email, nombre, mercadopago_wallet_id, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ developers: data });
    }

    // ─── ANALYTICS ───────────────────────────
    if (action === 'analytics') {
      const { data, error } = await supabase
        .from('web_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return json({ error: error.message }, 500);
      return json({ analytics: data });
    }

    // ─── PAYOUTS ─────────────────────────────
    if (action === 'payouts') {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('id, monto, estado, mercadopago_wallet_id, created_at, processed_at, developer_id')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ payouts: data });
    }

    // ─── APPROVE PAYOUT ──────────────────────
    if (action === 'payout_approve') {
      const { payout_id } = params;
      if (!payout_id) return json({ error: 'payout_id requerido' }, 400);

      const { error } = await supabase
        .from('payout_requests')
        .update({ estado: 'pagado', processed_at: new Date().toISOString() })
        .eq('id', payout_id);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true, message: 'Pago aprobado' });
    }

    // ─── DOWNLOAD TOKENS ─────────────────────
    if (action === 'tokens') {
      const { data, error } = await supabase
        .from('download_tokens')
        .select('id, token, max_downloads, downloads_used, expires_at, created_at, purchase_id')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) return json({ error: error.message }, 500);
      return json({ tokens: data });
    }

    // ─── LICENSE CHECKS (audit log) ──────────
    if (action === 'license_checks') {
      const { license_id } = params;
      let query = supabase
        .from('license_checks')
        .select('id, license_id, hardware_id, ip_address, checked_at')
        .order('checked_at', { ascending: false })
        .limit(200);
      
      if (license_id) {
        query = query.eq('license_id', license_id);
      }

      const { data, error } = await query;
      if (error) return json({ error: error.message }, 500);
      return json({ checks: data });
    }

    return json({ error: `Acción desconocida: ${action}` }, 400);

  } catch (err) {
    console.error('admin-dashboard error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
