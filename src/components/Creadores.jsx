import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import './Creadores.css';

export default function Creadores() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mocking data para visualización estética de la arquitectura
  const analyticsData = [
    { mes: 'Oct', vistas: 120, ingresos: 12 },
    { mes: 'Nov', vistas: 450, ingresos: 45 },
    { mes: 'Dic', vistas: 890, ingresos: 89 },
    { mes: 'Ene', vistas: 1200, ingresos: 120 },
    { mes: 'Feb', vistas: 1800, ingresos: 180 },
    { mes: 'Mar', vistas: 2400, ingresos: 240 },
  ];

  const gananciasAcumuladas = 240; // En PEN o USD
  const metaMinima = 20;

  useEffect(() => {
    // Simula comprobación de sesión en Supabase
    setTimeout(() => {
      setIsAuth(true); // Cambiar a true para mostrar la Dashboard
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="creadores-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)', color: '#fff'}}>
        <div className="loader"></div>
      </div>
    );
  }

  // --- Formulario de Registro ---
  if (!isAuth) {
    return (
      <div className="creadores-page">
        <Navbar />
        <main className="creadores-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="creadores-login"
          >
            <h1>Portal de Creadores Vox</h1>
            <p>Monetiza tus librerías de programación Open Source.</p>
            
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setIsAuth(true); }}>
              <input type="email" placeholder="Tu Correo de Mercado Pago" required />
              <input type="password" placeholder="Contraseña segura" required />
              <button type="submit" className="btn-primary">Registrarse / Entrar</button>
            </form>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Dashboard Integral ---
  return (
    <div className="creadores-page dashboard-active">
      <Navbar />
      <main className="creadores-dashboard">
        <header className="dashboard-header">
          <div>
            <h1>Mi Panel de Creador</h1>
            <p>Tus ganancias provienen del 50% de ingresos AdSense de tus librerías en VoxPub.</p>
          </div>
          <button className="btn-outline" onClick={() => setIsAuth(false)}>Cerrar Sesión</button>
        </header>

        <div className="dashboard-metrics">
          <motion.div className="metric-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3>Librerías Publicadas</h3>
            <span className="metric-value">3</span>
            <span className="metric-badge active">Activas</span>
          </motion.div>
          
          <motion.div className="metric-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3>Visitas este Mes</h3>
            <span className="metric-value">2,400</span>
            <span className="metric-trend positive">↑ +33%</span>
          </motion.div>

          <motion.div className="metric-card highlight" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3>Saldo Acumulado</h3>
            <span className="metric-value">S/. {gananciasAcumuladas}</span>
            <div className="payout-action">
              <button 
                className="btn-payout" 
                disabled={gananciasAcumuladas < metaMinima}
              >
                {gananciasAcumuladas >= metaMinima ? 'Retirar a Mercado Pago' : `Faltan S/. ${metaMinima - gananciasAcumuladas} para retirar`}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-grid">
          {/* Gráfica de Ingresos Animada */}
          <motion.div className="chart-container box-glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2>Rendimiento de AdSense (6 Meses)</h2>
            <div className="mini-chart">
              {analyticsData.map((d, index) => {
                const heightPercent = (d.ingresos / 240) * 100;
                return (
                  <div key={index} className="chart-bar-group">
                    <div className="chart-bar-bg">
                      <motion.div 
                        className="chart-bar-fill" 
                        initial={{ height: 0 }} 
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      ></motion.div>
                    </div>
                    <span className="chart-label">{d.mes}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Historial de Pagos */}
          <motion.div className="history-container box-glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2>Historial de Pagos</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>28 Feb, 2026</td>
                  <td>S/. 180.00</td>
                  <td><span className="status-badge paid">Pagado</span></td>
                </tr>
                <tr>
                  <td>31 Ene, 2026</td>
                  <td>S/. 120.00</td>
                  <td><span className="status-badge paid">Pagado</span></td>
                </tr>
                <tr>
                  <td>30 Dic, 2025</td>
                  <td>S/. 89.00</td>
                  <td><span className="status-badge paid">Pagado</span></td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
