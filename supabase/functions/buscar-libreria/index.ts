// @ts-nocheck
// ============================================================
// EDGE FUNCTION: buscar-libreria
// Busca y lista librerías del directorio VoxPub.
//
// Endpoint: POST /functions/v1/buscar-libreria
// Body: { query?, limit?, offset? }
// Response: { libraries: [...], total: number }
//
// También sirve para:
//   - GET sin body → lista las 50 más recientes
//   - POST { query: "auth" } → busca por nombre/descripción
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let query = '';
    let limit = 50;
    let offset = 0;

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        query = body.query || '';
        limit = Math.min(body.limit || 50, 100);
        offset = body.offset || 0;
      } catch {
        // Ignorar body inválido, usar defaults
      }
    }

    // Construir query
    let dbQuery = supabase
      .from('vox_libraries')
      .select('id, nombre_paquete, version_actual, descripcion, autor_email, downloads_count, created_at', { count: 'exact' });

    // Filtro de búsqueda por nombre o descripción
    if (query) {
      dbQuery = dbQuery.or(`nombre_paquete.ilike.%${query}%,descripcion.ilike.%${query}%`);
    }

    dbQuery = dbQuery
      .order('downloads_count', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: libraries, count, error } = await dbQuery;

    if (error) {
      console.error('buscar-libreria error:', error);
      return new Response(
        JSON.stringify({ error: 'Error buscando librerías' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Para cada librería, obtener nombre del developer
    const enriched = [];
    for (const lib of (libraries || [])) {
      // Buscar developer name
      let autorNombre = lib.autor_email || 'Anónimo';
      if (lib.autor_email) {
        const { data: dev } = await supabase
          .from('developers')
          .select('nombre')
          .eq('email', lib.autor_email)
          .single();
        if (dev?.nombre) autorNombre = dev.nombre;
      }

      enriched.push({
        id: lib.id,
        nombre: lib.nombre_paquete,
        version: lib.version_actual,
        descripcion: lib.descripcion,
        autor: autorNombre,
        descargas: lib.downloads_count || 0,
        created_at: lib.created_at,
      });
    }

    return new Response(
      JSON.stringify({ libraries: enriched, total: count || 0 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('buscar-libreria error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
