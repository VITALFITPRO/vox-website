// @ts-nocheck
// ============================================================
// EDGE FUNCTION: publicar-libreria
// Publica o actualiza una librería en VoxPub.
//
// Endpoint: POST /functions/v1/publicar-libreria
// Body: { nombre, version, descripcion, autor_email, zip_base64 }
// Response (OK):    { success: true, url: string }
// Response (Error): { error: string }
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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- RATE LIMITING ---
    const rateStatus = await checkRateLimit(req, supabase, 'publicar-libreria');
    if (!rateStatus.allowed) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas publicaciones seguidas. Intenta en 15 minutos.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { nombre, version, descripcion, autor_email, zip_base64 } = body;

    if (!nombre || !version || !autor_email) {
      return new Response(
        JSON.stringify({ error: 'nombre, version y autor_email son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar nombre de paquete (solo letras, números, guiones, underscores, dos puntos)
    if (!/^[a-zA-Z0-9_:\-]+$/.test(nombre)) {
      return new Response(
        JSON.stringify({ error: 'Nombre de paquete inválido. Solo letras, números, :, - y _' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verificar que el autor existe en developers
    const { data: dev, error: devError } = await supabase
      .from('developers')
      .select('id')
      .eq('email', autor_email)
      .single();

    if (devError || !dev) {
      return new Response(
        JSON.stringify({ error: 'Desarrollador no autorizado. Regístrate primero en /creadores' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Si hay zip, subirlo a Storage
    if (zip_base64) {
      const binary = atob(zip_base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const filePath = `${nombre}/${version}.zip`;
      const { error: storageError } = await supabase.storage
        .from('vox-libraries')
        .upload(filePath, bytes, { contentType: 'application/zip', upsert: true });

      if (storageError) {
        console.error('Storage error:', storageError);
        return new Response(
          JSON.stringify({ error: 'Error subiendo archivo a Storage' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 3. Verificar si ya existe el paquete
    const { data: existing } = await supabase
      .from('vox_libraries')
      .select('id, developer_id')
      .eq('nombre_paquete', nombre)
      .single();

    if (existing) {
      // Verificar que el mismo developer es dueño
      if (existing.developer_id !== dev.id) {
        return new Response(
          JSON.stringify({ error: 'Este paquete pertenece a otro desarrollador' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Actualizar versión
      const { error: updateError } = await supabase
        .from('vox_libraries')
        .update({
          version_actual: version,
          descripcion: descripcion || undefined,
          autor_email: autor_email,
        })
        .eq('id', existing.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Error actualizando librería' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Crear nueva
      const { error: insertError } = await supabase
        .from('vox_libraries')
        .insert({
          developer_id: dev.id,
          nombre_paquete: nombre,
          version_actual: version,
          descripcion: descripcion || '',
          autor_email: autor_email,
        });

      if (insertError) {
        return new Response(
          JSON.stringify({ error: 'Error registrando librería en BD' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, url: `https://voxlang.dev/directorio/${nombre}` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('publicar-libreria error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
