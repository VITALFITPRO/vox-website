import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const body = await req.json();
    const { nombre, version, descripcion, autor_email, zip_base64 } = body;

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verifica autor en tabla developers
    const { data: dev } = await supabase
      .from('developers')
      .select('id')
      .eq('email', autor_email)
      .single();

    if (!dev) {
      return new Response(JSON.stringify({ error: 'Desarrollador no autorizado' }), { status: 403 });
    }

    // Convertir de base64 a Uint8Array
    const binary = atob(zip_base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    // Sube zip a Storage bucket vox-libraries
    const filePath = `\${nombre}/\${version}.zip`;
    const { error: storageError } = await supabase.storage
      .from('vox-libraries')
      .upload(filePath, bytes, { contentType: 'application/zip', upsert: true });

    if (storageError) {
      console.error(storageError);
      return new Response(JSON.stringify({ error: 'Error subiendo archivo a Storage' }), { status: 500 });
    }

    // INSERT en vox_libraries
    const { error: dbError } = await supabase
      .from('vox_libraries')
      .upsert({
        nombre_paquete: nombre,
        version: version,
        descripcion: descripcion,
        autor_email: autor_email
      }, { onConflict: 'nombre_paquete' });

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error registrando librería en BD' }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true, url: `https://voxlang.dev/directorio/\${nombre}` }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Error interno en la Edge Function' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
