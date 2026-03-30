// @ts-nocheck
// ============================================================
// EDGE FUNCTION: validate-download
// Valida un token de descarga, verifica IP y genera URL firmada
//
// Endpoint: POST /functions/v1/validate-download
// Body: { token, platform } donde platform = 'windows' | 'mac' | 'linux'
// Response (OK): { download_url: string, remaining: number }
// Response (Error): { error: string, code: string }
//
// SECRETS necesarios:
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeo de plataforma a archivo en Storage
const PLATFORM_FILES: Record<string, string> = {
  windows: 'vox-sdk-windows.zip',
  mac: 'vox-sdk-macos.zip',
  linux: 'vox-sdk-linux.tar.gz',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token, platform } = await req.json();

    // Validar inputs
    if (!token || !platform) {
      return new Response(
        JSON.stringify({ error: 'Token y plataforma son requeridos', code: 'MISSING_PARAMS' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!PLATFORM_FILES[platform]) {
      return new Response(
        JSON.stringify({ error: 'Plataforma no válida', code: 'INVALID_PLATFORM' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener IP del cliente
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || '0.0.0.0';

    const userAgent = req.headers.get('user-agent') || '';

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar el token
    const { data: tokenData, error: tokenError } = await supabase
      .from('download_tokens')
      .select('id, expires_at, max_downloads, purchase_id')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: 'Token no válido o no encontrado', code: 'INVALID_TOKEN' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verificar expiración
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Este enlace de descarga ha expirado', code: 'TOKEN_EXPIRED' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Contar descargas totales de este token
    const { count: totalDownloads } = await supabase
      .from('downloads')
      .select('*', { count: 'exact', head: true })
      .eq('token_id', tokenData.id);

    if ((totalDownloads || 0) >= tokenData.max_downloads) {
      return new Response(
        JSON.stringify({
          error: 'Has alcanzado el límite de descargas para este token',
          code: 'MAX_DOWNLOADS',
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verificar si esta IP ya descargó esta plataforma
    const { data: existingDownload } = await supabase
      .from('downloads')
      .select('id')
      .eq('token_id', tokenData.id)
      .eq('ip_address', clientIP)
      .eq('platform', platform)
      .single();

    if (existingDownload) {
      return new Response(
        JSON.stringify({
          error: 'Ya descargaste esta versión desde este dispositivo',
          code: 'ALREADY_DOWNLOADED',
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Registrar la descarga
    const { error: insertError } = await supabase
      .from('downloads')
      .insert({
        token_id: tokenData.id,
        ip_address: clientIP,
        platform,
        user_agent: userAgent.slice(0, 500), // limitar tamaño
      });

    if (insertError) {
      console.error('Error registrando descarga:', insertError);
      // Si es violación de unique constraint, ya se descargó
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Ya descargaste esta versión', code: 'ALREADY_DOWNLOADED' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Error al procesar descarga', code: 'INSERT_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Generar URL firmada (expira en 5 minutos)
    const fileName = PLATFORM_FILES[platform];
    const { data: signedUrlData, error: storageError } = await supabase
      .storage
      .from('sdk-files')
      .createSignedUrl(fileName, 300); // 300 segundos = 5 minutos

    if (storageError || !signedUrlData?.signedUrl) {
      console.error('Error generando URL firmada:', storageError);
      return new Response(
        JSON.stringify({ error: 'Error generando enlace de descarga', code: 'STORAGE_ERROR' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calcular descargas restantes
    const remaining = tokenData.max_downloads - (totalDownloads || 0) - 1;

    return new Response(
      JSON.stringify({
        download_url: signedUrlData.signedUrl,
        remaining,
        platform,
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
