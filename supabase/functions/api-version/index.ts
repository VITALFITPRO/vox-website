import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const responseBody = {
    version: "0.2.0",
    url_descarga: "https://voxlang.dev",
    novedades: "Actualización de seguridad DRM OTA y Fix de Bugs LSP"
  };

  return new Response(
    JSON.stringify(responseBody),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
