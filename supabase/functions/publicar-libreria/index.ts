import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nombre, version, descripcion, autor_email, archivo_zip_base64 } = body;

    if (!nombre || !version || !archivo_zip_base64) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos' }), { status: 400, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Verificar autor
    const { data: devAuth, error: devError } = await supabase
      .from('developers')
      .select('id')
      .eq('email', autor_email)
      .single();

    if (devError || !devAuth) {
      return new Response(JSON.stringify({ error: 'Autor no registrado en la plataforma.' }), { status: 403, headers: corsHeaders });
    }

    // 2. Verificar nombre tomado por otro (si existe la libreria y no es el autor)
    const { data: existingLib } = await supabase
      .from('vox_libraries')
      .select('id, developer_id')
      .eq('nombre', nombre)
      .single();

    if (existingLib && existingLib.developer_id !== devAuth.id) {
      return new Response(JSON.stringify({ error: 'El nombre de la librería ya está tomado por otro creador.' }), { status: 403, headers: corsHeaders });
    }

    // 3. Subir el ZIP a Storage
    const zipBytes = decode(archivo_zip_base64);
    const storagePath = `${nombre}/${version}.zip`;

    const { error: uploadError } = await supabase.storage
      .from('vox-libraries')
      .upload(storagePath, zipBytes, {
        contentType: 'application/zip',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Insertar/Actualizar metadatos
    const { error: dbError } = await supabase
      .from('vox_libraries')
      .upsert({
        nombre,
        version,
        descripcion,
        developer_id: devAuth.id,
        storage_path: storagePath,
        updated_at: new Date().toISOString()
      }, { onConflict: 'nombre' });

    if (dbError) throw dbError;

    // 5. Retornar éxito
    const { data: publicUrlData } = supabase.storage.from('vox-libraries').getPublicUrl(storagePath);

    return new Response(
      JSON.stringify({ 
        success: true, 
        url_descarga: publicUrlData.publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error al publicar librería:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor al publicar la librería' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
