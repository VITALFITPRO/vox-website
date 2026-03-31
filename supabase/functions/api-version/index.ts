import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  return new Response(
    JSON.stringify({ 
      version: "0.1.0",
      url: "https://voxlang.dev",
      novedades: "Primera versión" 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
