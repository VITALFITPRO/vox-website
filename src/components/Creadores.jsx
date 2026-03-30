import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Creadores.css';

export default function Creadores() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authMsg, setAuthMsg] = useState('');

  // States Dashboard
  const [ingresos, setIngresos] = useState(125.50);
  const [pagosRecibidos, setPagosRecibidos] = useState([
    { id: 1, monto: 50.00, estado: 'pagado', fecha: '2026-02-15' },
    { id: 2, monto: 75.50, estado: 'pagado', fecha: '2026-03-10' }
  ]);
  const [solicitando, setSolicitando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMsg('Cargando...');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg(error.message);
      else setAuthMsg('');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthMsg(error.message);
      else setAuthMsg('Revisa tu correo para verificar tu cuenta.');
    }
  };

  const handleGithubOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) setAuthMsg(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  if (loading) {
    return <div className="creadores-container"><h2>Cargando...</h2></div>;
  }

  if (!session) {
    return (
      <div className="creadores-container" style={{maxWidth: '500px', margin: '0 auto', textAlign: 'center'}}>
        <h1>VoxPub Creadores</h1>
        <p>Inicia sesión para subir librerías y ganar dinero.</p>
        
        <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px'}}>
          <input 
            type="email" 
            placeholder="Tu email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{padding: '12px', borderRadius: '8px', border: '1px solid #ccc'}}
          />
          <input 
            type="password" 
            placeholder="Tu contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{padding: '12px', borderRadius: '8px', border: '1px solid #ccc'}}
          />
          <button className="primary" type="submit">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <p style={{margin: '15px 0'}}>{authMsg}</p>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline'}}
        >
          {isLogin ? 'O crea una cuenta nueva' : 'Ya tengo una cuenta'}
        </button>

        <div style={{margin: '30px 0'}}>o</div>

        <button onClick={handleGithubOAuth} style={{padding: '12px', background: '#24292e', color: 'white', border: 'none', borderRadius: '8px', width: '100%', cursor: 'pointer'}}>
          Continuar con GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="creadores-container">
      <header className="creadores-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>Dashboard Creadores</h1>
          <p>Bienvenido, {session.user.email}</p>
        </div>
        <button onClick={handleLogout} style={{padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer'}}>
          Cerrar sesión
        </button>
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
