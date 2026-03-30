import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente optimizado para Analytics pasivo
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generar o recuperar SessionUUID anónimo en memoria (localStorage)
function getAnonymousSession() {
  let sessionId = localStorage.getItem('vox_tracker_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('vox_tracker_id', sessionId);
  }
  return sessionId;
}

// Deducir el dispositivo del User Agent
function detectDevice(userAgent) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'Movil';
  }
  return 'Desktop';
}

export default function useTracker() {
  const location = useLocation();

  useEffect(() => {
    // Para evitar spam durante desarrollo local (Opcional)
    if (window.location.hostname === 'localhost') return;

    const trackPage = async () => {
      const sessionId = getAnonymousSession();
      const ruta = location.pathname + location.search;
      const ua = navigator.userAgent;
      const dispositivo = detectDevice(ua);
      
      try {
        // Enviar a Supabase asíncronamente (fuego cruzado)
        // La Geolocalización (País) se derivaría de la cabecera IP en un edge webhook real,
        // o supabase inyectará el país. Para este hook frontend, enviamos la base.
        await supabase.from('web_analytics').insert({
          session_id: sessionId,
          ruta: ruta,
          user_agent: ua,
          dispositivo: dispositivo,
        });
      } catch (err) {
        // Silencioso. Si el tracker falla, no rompemos la UI del usuario.
        console.warn("Tracker timeout");
      }
    };

    trackPage();
  }, [location]); 
}
