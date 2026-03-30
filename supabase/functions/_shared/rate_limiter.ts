import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Validador de Rate Limiting por IP.
 * Límite máximo: 100 peticiones cada 15 minutos en el endpoint indicado.
 */
export async function checkRateLimit(
  req: Request, 
  supabaseAdmin: SupabaseClient, 
  endpointName: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  
  // Extraer la IP real del cliente detrás del proxy o balanceador
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const WINDOW_MINUTES = 15;
  const MAX_REQUESTS = 100;

  // Calculamos la hora de inicio de la ventana actual dinámicamente
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - WINDOW_MINUTES);

  try {
    // 1. Verificar cuántas peticiones ha hecho la IP en la ventana activa
    const { data: logs, error: countError } = await supabaseAdmin
      .from('rate_limit_logs')
      .select('id, request_count')
      .eq('ip', ip)
      .eq('endpoint', endpointName)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1);

    if (countError) {
      console.error("Rate Limit Select Error:", countError);
      return { allowed: true }; // Fallback optimista si falla la DB interna
    }

    if (logs && logs.length > 0) {
      const currentCount = logs[0].request_count;
      if (currentCount >= MAX_REQUESTS) {
        return { allowed: false, retryAfter: 900 }; // 15 mins
      }
      
      // Tiene espacio: Incrementamos su contador (Upsert/Update manual)
      await supabaseAdmin
        .from('rate_limit_logs')
        .update({ request_count: currentCount + 1 })
        .eq('id', logs[0].id);
        
      return { allowed: true };
    }

    // 2. Primera petición de la IP en los últimos 15 mins (Crear log nuevo)
    await supabaseAdmin
      .from('rate_limit_logs')
      .insert({
        ip: ip,
        endpoint: endpointName,
        request_count: 1,
        window_start: new Date().toISOString()
      });

    return { allowed: true };
  } catch (error) {
    console.error("General Rate Limit Error:", error);
    return { allowed: true }; 
  }
}
