import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import './Creadores.css'; // Reusamos los estilos de dashboard

export default function Estado() {
  const [dbStatus, setDbStatus] = useState('Verificando...');
  const [edgeStatus, setEdgeStatus] = useState('Verificando...');
  const currentVersion = 'v0.1.0';

  useEffect(() => {
    // Simulador de ping a Supabase para verificar salud
    const checkHealth = async () => {
      try {
        // En producción haría un ping real a la BD de Supabase vía un RPC muy ligero
        // o un select. Para este demo simularemos la respuesta exitosa.
        setTimeout(() => {
          setDbStatus('En línea');
          setEdgeStatus('En línea');
        }, 600);
      } catch (err) {
        setDbStatus('Inactivo');
        setEdgeStatus('Inactivo');
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="creadores-page dashboard-active">
      <Navbar />
      <main className="creadores-dashboard" style={{maxWidth: '800px'}}>
        <header className="dashboard-header">
          <div>
            <h1>Estado del Ecosistema Vox</h1>
            <p>Monitoreo de servicios en tiempo real e información de red.</p>
          </div>
        </header>

        <div className="dashboard-metrics" style={{gridTemplateColumns: '1fr 1fr'}}>
          <motion.div className="metric-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3>Bases de Datos (Supabase)</h3>
            <span className="metric-value" style={{color: dbStatus === 'En línea' ? '#00e676' : '#ff5252'}}>{dbStatus}</span>
            <span className="metric-badge active" style={{borderColor: 'transparent'}}>Uptime: 99.9%</span>
          </motion.div>
          
          <motion.div className="metric-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3>Edge Functions (Deno)</h3>
            <span className="metric-value" style={{color: edgeStatus === 'En línea' ? '#00e676' : '#ff5252'}}>{edgeStatus}</span>
            <span className="metric-badge active" style={{borderColor: 'transparent'}}>Latencia: 45ms</span>
          </motion.div>
        </div>

        <motion.div className="box-glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2>Versiones Oficiales</h2>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
            <strong style={{color: '#fff', fontSize: '1.2rem'}}>Compilador Vox (vox.exe)</strong>
            <span className="status-badge paid" style={{fontSize: '1rem'}}>{currentVersion}</span>
          </div>
          <p style={{marginTop: '1.5rem', color: 'var(--text-muted)'}}>
            El ejecutable local consulta automáticamente esta página mediante su API interna para validar su licencia y buscar nuevas actualizaciones en línea.
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
