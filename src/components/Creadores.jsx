import { useState, useEffect } from 'react';
import './Creadores.css';

export default function Creadores() {
  const [ingresos, setIngresos] = useState(125.50); // Mínimo S/20 para cobrar
  const [pagosRecibidos, setPagosRecibidos] = useState([
    { id: 1, monto: 50.00, estado: 'pagado', fecha: '2026-02-15' },
    { id: 2, monto: 75.50, estado: 'pagado', fecha: '2026-03-10' }
  ]);
  const [solicitando, setSolicitando] = useState(false);

  // Registro falso/placeholder
  const [isRegistrado, setIsRegistrado] = useState(true);

  const solicitarPago = () => {
    if (ingresos >= 20) {
      setSolicitando(true);
      setTimeout(() => {
        alert("Pago de S/ " + ingresos + " solicitado a tu cuenta de Mercado Pago.");
        setPagosRecibidos([{ id: Date.now(), monto: ingresos, estado: 'pendiente', fecha: new Date().toISOString().split('T')[0] }, ...pagosRecibidos]);
        setIngresos(0);
        setSolicitando(false);
      }, 1500);
    } else {
      alert("El monto mínimo para retirar es de S/. 20.00");
    }
  };

  if (!isRegistrado) {
    return (
      <div className="creadores-container">
        <h1>Registro de Developer</h1>
        <p>Inscríbete para subir librerías al VoxPub y ganar dinero (50% Revenue Share).</p>
        <button className="primary" onClick={() => setIsRegistrado(true)}>Registrar mi cuenta</button>
      </div>
    );
  }

  return (
    <div className="creadores-container">
      <header className="creadores-header">
        <h1>Dashboard Creadores</h1>
        <p>Monetiza tus librerías de VoxPub (50% AdSense y regalías)</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Mis Librerías Publicadas</h3>
          <ul>
            <li>vox:charts - 1.2K descargas</li>
            <li>vox:auth_google - 500 descargas</li>
            <li>vox:animations - 3.4K descargas</li>
          </ul>
        </div>
        
        <div className="dashboard-card stat-card">
          <h3>Total Visitas este Mes</h3>
          <div className="stat-number">12,450</div>
          <p className="stat-trend positive">+15% desde el mes pasado</p>
        </div>

        <div className="dashboard-card">
          <h3>Balance Acumulado</h3>
          <div className="stat-number balance">S/. {ingresos.toFixed(2)}</div>
          <button 
            className="withdraw-btn" 
            onClick={solicitarPago} 
            disabled={ingresos < 20 || solicitando}
          >
            {solicitando ? "Procesando..." : "Solicitar Pago (> S/.20)"}
          </button>
        </div>

        <div className="dashboard-card full-width">
          <h3>Gráfica de Ingresos</h3>
          {/* Gráfico placeholder */}
          <div className="chart-placeholder">
            [================= Chart Area =================]
            <br />
            (Enero: S/40 | Febrero: S/50 | Marzo: S/75)
          </div>
        </div>

        <div className="dashboard-card full-width">
          <h3>Historial de Pagos</h3>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto (PEN)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagosRecibidos.map(pago => (
                <tr key={pago.id}>
                  <td>{pago.fecha}</td>
                  <td>S/. {pago.monto.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${pago.estado}`}>
                      {pago.estado.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
