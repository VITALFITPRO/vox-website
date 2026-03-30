import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Asumimos supabase configurado en lib/supabase
import { supabase } from '../lib/supabase'; // Ajustar ruta si es supabaseClient.js

export function useTracker() {
  const location = useLocation();
  
  // Generar un UUID anónimo de sesión que dura mientras la tab esté abierta
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    async function track() {
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        await supabase.from('web_analytics').insert({
          ruta: location.pathname + location.search,
          session_id: sessionId,
          user_agent: navigator.userAgent,
          dispositivo: isMobile ? 'Mobile' : 'Desktop'
          // El país "pais" debe ser detectado y llenado vía headers en Edge Functions
          // o via default Supabase triggers con `request.headers.get('x-vercel-ip-country')`
        });
      } catch (err) {
        console.error("Error en tracker silencioso", err);
      }
    }
    
    // Solo trackear si supabase existe y está configurado
    if (supabase) {
      track();
    }
  }, [location, sessionId]);
}
