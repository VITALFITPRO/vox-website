// @ts-nocheck
// ============================================================
// EDGE FUNCTION: mercadopago-webhook
// Recibe notificaciones de Mercado Pago cuando se aprueba un pago
// Crea purchase, download_token, license y envía email
//
// Endpoint: POST /functions/v1/mercadopago-webhook
// Llamado por: Mercado Pago automáticamente
//
// SECRETS necesarios:
//   - MERCADOPAGO_ACCESS_TOKEN
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
//   - SITE_URL
//   - RESEND_API_KEY (opcional, para emails)
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const body = await req.json();

    // Mercado Pago envía diferentes tipos de notificaciones
    // Solo nos interesan los pagos
    if (body.type !== 'payment' && body.action !== 'payment.created') {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: 'No payment ID' }), { status: 400 });
    }

    // --- 1. VALIDACIÓN DE FIRMA CRIPTOGRÁFICA (MERCADO PAGO) ---
    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');
    const webhookSecret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET');

    if (xSignature && xRequestId && webhookSecret) {
      const parts = xSignature.split(',');
      let ts = '';
      let v1 = '';
      parts.forEach(p => {
        if (p.startsWith('ts=')) ts = p.substring(3);
        if (p.startsWith('v1=')) v1 = p.substring(3);
      });

      const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
      
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );
      
      // Convertir v1 hex a Uint8Array
      const signatureBytes = new Uint8Array(v1.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      
      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        encoder.encode(manifest)
      );

      if (!isValid) {
        console.error('Firma de MercadoPago inválida');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 403 });
      }
    }

    const MP_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!;
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://voxlang.com';
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    // Consultar detalle del pago en Mercado Pago
    const paymentRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
      }
    );

    if (!paymentRes.ok) {
      console.error('Error al consultar pago:', await paymentRes.text());
      return new Response(JSON.stringify({ error: 'Error consultando pago' }), { status: 500 });
    }

    const payment = await paymentRes.json();

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      console.log(`Pago ${paymentId} status: ${payment.status} — ignorado`);
      return new Response(JSON.stringify({ received: true, status: payment.status }), { status: 200 });
    }

    // Extraer datos del comprador y el desarrollador a pagar
    let buyerData = { email: '', name: '', phone: '', developer_id: null };
    try {
      buyerData = JSON.parse(payment.external_reference || '{}');
    } catch {
      buyerData.email = payment.payer?.email || '';
      buyerData.name = `${payment.payer?.first_name || ''} ${payment.payer?.last_name || ''}`.trim();
    }

    // Conectar a Supabase con service_role (acceso completo)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Verificar si ya procesamos este pago (idempotencia)
    const { data: existing } = await supabase
      .from('purchases')
      .select('id')
      .eq('mercadopago_payment_id', String(paymentId))
      .single();

    if (existing) {
      console.log(`Pago ${paymentId} ya procesado — ignorado`);
      return new Response(JSON.stringify({ received: true, already_processed: true }), { status: 200 });
    }

    // 2. INSERT en purchases
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        email: buyerData.email,
        name: buyerData.name,
        phone: buyerData.phone,
        mercadopago_payment_id: String(paymentId),
        mercadopago_status: payment.status,
        amount: payment.transaction_amount,
        currency: payment.currency_id || 'USD',
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error insertando purchase:', purchaseError);
      return new Response(JSON.stringify({ error: 'Error guardando compra' }), { status: 500 });
    }

    // 3. Generar download token (expira en 72 horas)
    const downloadToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

    const { error: tokenError } = await supabase
      .from('download_tokens')
      .insert({
        purchase_id: purchase.id,
        token: downloadToken,
        expires_at: expiresAt,
        max_downloads: 3,
      });

    if (tokenError) {
      console.error('Error insertando token:', tokenError);
    }

    // 4. Generar license key (usando la función SQL)
    const { data: licenseData } = await supabase.rpc('generate_license_key');
    const licenseKey = licenseData || `VOX-${crypto.randomUUID().slice(0, 4).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

    const { error: licenseError } = await supabase
      .from('licenses')
      .insert({
        purchase_id: purchase.id,
        license_key: licenseKey,
        assigned_user: buyerData.email,
        status: 'active'
      });

    if (licenseError) {
      console.error('Error insertando licencia:', licenseError);
    }

    // 4.5 Suma de fondos al balance del developer en tabla developers
    if (buyerData.developer_id && payment.transaction_amount) {
      // Usar un RPC de incremento transaccional seguro
      const { error: balanceError } = await supabase.rpc('increment_developer_balance', {
        dev_id: buyerData.developer_id,
        amount_to_add: payment.transaction_amount
      });

      if (balanceError) {
        console.error('Error sumando fondos al developer:', balanceError);
      } else {
        console.log(`Fondos sumados al developer ${buyerData.developer_id}: S/.${payment.transaction_amount}`);
      }
    }

    // 5. Enviar email con link de descarga (si Resend está configurado)
    if (RESEND_API_KEY && buyerData.email) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Vox <noreply@voxlang.com>',
            to: buyerData.email,
            subject: '🎉 Tu SDK de Vox está listo para descargar',
            html: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #ffffff;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #42A5F5; font-size: 28px;">¡Gracias por tu compra, ${buyerData.name}!</h1>
                </div>
                
                <div style="background: #111114; border: 1px solid #1e1e24; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h2 style="color: #ffffff; font-size: 18px; margin-bottom: 16px;">📦 Descarga tu SDK</h2>
                  <p style="color: #9ca3af; line-height: 1.6;">
                    Haz clic en el botón para acceder a tu página de descarga.
                    Disponible para Windows, macOS y Linux.
                  </p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${SITE_URL}/descargar/${downloadToken}" 
                       style="background: linear-gradient(135deg, #1565C0, #42A5F5); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                      Ir a descargas
                    </a>
                  </div>
                  <p style="color: #666; font-size: 13px; text-align: center;">
                    Este enlace expira en 72 horas. Máximo 3 descargas.
                  </p>
                </div>

                <div style="background: #111114; border: 1px solid #1e1e24; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h2 style="color: #ffffff; font-size: 18px; margin-bottom: 12px;">🔑 Tu licencia</h2>
                  <p style="font-family: 'JetBrains Mono', monospace; color: #42A5F5; font-size: 20px; text-align: center; letter-spacing: 2px; padding: 12px; background: rgba(66,165,245,0.1); border-radius: 8px;">
                    ${licenseKey}
                  </p>
                  <p style="color: #9ca3af; font-size: 13px; margin-top: 12px;">
                    Guarda esta licencia. La necesitarás para activar el SDK en tu equipo.
                  </p>
                </div>

                <div style="text-align: center; color: #666; font-size: 12px; margin-top: 32px;">
                  <p>Hecho para la comunidad — Vox</p>
                  <p>¿Necesitas ayuda? serviciotecnicoarv@gmail.com</p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          console.error('Error enviando email:', await emailRes.text());
        }
      } catch (emailErr) {
        console.error('Error con Resend:', emailErr);
      }
    }

    console.log(`✅ Pago ${paymentId} procesado. Token: ${downloadToken}, License: ${licenseKey}`);

    return new Response(
      JSON.stringify({ received: true, processed: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: 'Error procesando webhook' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
