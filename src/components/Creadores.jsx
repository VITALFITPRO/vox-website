import { useState, useEffect } from 'react';
import { supabase, callEdgeFunction } from '../lib/supabase';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function GraficaBarras({ datos, max }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', padding: '0 4px' }}>
      {datos.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              width: '100%',
              height: `${max > 0 ? (val / max) * 100 : 0}%`,
              background: i === datos.length - 1
                ? 'linear-gradient(180deg, #818cf8, #6366f1)'
                : 'rgba(99,102,241,0.35)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.5s ease',
              minHeight: val > 0 ? '4px' : '0',
            }}
            title={`S/. ${val.toFixed(2)}`}
          />
          <span style={{ fontSize: '9px', color: '#52525b' }}>{MESES[i]}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ titulo, valor, subtitulo, color }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      border: `1px solid ${color ? color + '40' : 'rgba(99,102,241,0.3)'}`,
      borderRadius: '14px', padding: '20px', flex: 1, minWidth: '180px',
    }}>
      <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '8px' }}>{titulo}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: color || '#f4f4f5' }}>{valor}</div>
      {subtitulo && <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>{subtitulo}</div>}
    </div>
  );
}

export default function Creadores() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authMsg, setAuthMsg] = useState('');

  // Dashboard - datos reales
  const [libraries, setLibraries] = useState([]);
  const [balance, setBalance] = useState(0);
  const [viewsThisMonth, setViewsThisMonth] = useState(0);
  const [payHistory, setPayHistory] = useState([]);
  const [solicitando, setSolicitando] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos reales cuando hay sesión
  useEffect(() => {
    if (!session) return;
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    if (!session) return;
    setLoadingData(true);
    const userEmail = session.user.email;

    try {
      // 1. Auto-registrar como developer si no existe
      const regResult = await callEdgeFunction('creadores-api', {
        action: 'register_dev',
        email: userEmail,
        nombre: session.user.user_metadata?.full_name || userEmail.split('@')[0],
      });
      setIsRegistered(true);

      // 2. Cargar mis librerías
      const libResult = await callEdgeFunction('creadores-api', {
        action: 'my_libraries',
        email: userEmail,
      });
      setLibraries(libResult.libraries || []);

      // 3. Cargar balance y historial
      const earningsResult = await callEdgeFunction('creadores-api', {
        action: 'my_earnings',
        email: userEmail,
      });
      setBalance(earningsResult.balance || 0);
      setViewsThisMonth(earningsResult.views_this_month || 0);
      setPayHistory(earningsResult.history || []);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
    }
    setLoadingData(false);
  };

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
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) setAuthMsg(error.message);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const solicitarPago = async () => {
    if (balance < 20) {
      alert('El monto mínimo para retirar es de S/. 20.00');
      return;
    }
    setSolicitando(true);
    try {
      const result = await callEdgeFunction('creadores-api', {
        action: 'request_payout',
        email: session.user.email,
        monto: balance,
      });
      if (result.error) {
        alert(result.error);
      } else {
        alert(result.message || 'Solicitud de pago creada');
        loadDashboardData(); // Refrescar
      }
    } catch (err) {
      alert('Error solicitando pago: ' + err.message);
    }
    setSolicitando(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      Cargando...
    </div>
  );

  // ─── LOGIN ───────────────────────────────────────────────────────
  if (!session) return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{
        width: '100%', maxWidth: '440px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚀</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '800', margin: '0 0 8px' }}>VoxPub Creadores</h1>
          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
            Sube librerías y gana dinero con cada descarga.
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ padding: '13px 16px', borderRadius: '10px', background: '#0f0f1a', border: '1px solid rgba(99,102,241,0.3)', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <input
            type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{ padding: '13px 16px', borderRadius: '10px', background: '#0f0f1a', border: '1px solid rgba(99,102,241,0.3)', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" style={{
            padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', fontSize: '15px', fontWeight: '700',
          }}>
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        {authMsg && <p style={{ color: authMsg.startsWith('Revisa') ? '#34d399' : '#f87171', textAlign: 'center', fontSize: '13px', marginTop: '12px' }}>{authMsg}</p>}

        <div style={{ textAlign: 'center', margin: '20px 0', color: '#52525b', fontSize: '13px' }}>— o —</div>

        <button onClick={handleGithubOAuth} style={{
          width: '100%', padding: '13px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
          background: '#24292e', color: 'white', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <svg height="20" width="20" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Continuar con GitHub
        </button>

        <button onClick={() => setIsLogin(!isLogin)} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '13px' }}>
          {isLogin ? 'No tengo cuenta — Registrarme' : 'Ya tengo cuenta — Iniciar sesión'}
        </button>
      </div>
    </div>
  );

  // ─── DASHBOARD ───────────────────────────────────────────────────
  // Gráfica placeholder (se llenará con datos reales de payHistory)
  const monthlyData = new Array(12).fill(0);
  payHistory.forEach(p => {
    if (p.estado === 'pagado' && p.created_at) {
      const month = new Date(p.created_at).getMonth();
      monthlyData[month] += Number(p.monto) || 0;
    }
  });
  const maxIngreso = Math.max(...monthlyData, 1);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', color: 'white', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px' }}>Dashboard Creadores</h1>
            <p style={{ color: '#71717a', margin: 0, fontSize: '14px' }}>Hola, {session.user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadDashboardData} style={{
              padding: '10px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', cursor: 'pointer', fontSize: '13px',
            }}>
              🔄 Refrescar
            </button>
            <button onClick={handleLogout} style={{
              padding: '10px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontSize: '13px',
            }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {loadingData && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#71717a' }}>Cargando datos...</div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <StatCard titulo="Visitas este mes" valor={viewsThisMonth.toLocaleString()} subtitulo="en tus librerías" />
          <StatCard titulo="Balance acumulado (50% AdSense)" valor={`S/. ${balance.toFixed(2)}`} color="#34d399" />
          <StatCard titulo="Librerías publicadas" valor={libraries.length} subtitulo="activas en el directorio" />
        </div>

        {/* Gráfica ingresos */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: '700' }}>📈 Pagos recibidos por mes (S/.)</h3>
            <span style={{ fontSize: '12px', color: '#71717a' }}>Últimos 12 meses</span>
          </div>
          <GraficaBarras datos={monthlyData} max={maxIngreso} />
        </div>

        {/* Mis librerías */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: '700' }}>📦 Mis Librerías Publicadas</h3>
          {libraries.length === 0 ? (
            <p style={{ color: '#52525b', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
              Aún no has publicado librerías. Usa <code style={{ color: '#818cf8' }}>vox publicar</code> desde el CLI.
            </p>
          ) : (
            libraries.map((lib, i) => (
              <div key={lib.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < libraries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontFamily: 'monospace', color: '#818cf8' }}>{lib.nombre_paquete}</span>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#71717a' }}>
                  <span>v{lib.version_actual}</span>
                  <span>⬇ {(lib.downloads_count || 0).toLocaleString()} descargas</span>
                  <span>👁 {(lib.views_this_month || 0).toLocaleString()} vistas/mes</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Balance y retiro */}
        <div style={{
          background: 'linear-gradient(135deg, #0d2818, #064e3b)',
          border: '1px solid rgba(52,211,153,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#6ee7b7', marginBottom: '4px' }}>Balance disponible para retiro</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#34d399' }}>S/. {balance.toFixed(2)}</div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>Mínimo para solicitar: S/. 20.00</div>
          </div>
          <button
            onClick={solicitarPago}
            disabled={balance < 20 || solicitando}
            style={{
              padding: '14px 28px', borderRadius: '12px', border: 'none', cursor: balance < 20 ? 'not-allowed' : 'pointer',
              background: balance < 20 ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, #059669, #34d399)',
              color: balance < 20 ? '#6ee7b7' : 'white', fontSize: '15px', fontWeight: '700', opacity: solicitando ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {solicitando ? '⏳ Procesando...' : '💸 Solicitar Pago'}
          </button>
        </div>

        {/* Historial de pagos */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: '700' }}>🏦 Historial de Pagos</h3>
          {payHistory.length === 0 ? (
            <p style={{ color: '#52525b', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
              Sin solicitudes de pago aún
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  {['Fecha', 'Monto', 'Estado'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#71717a', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payHistory.map(pago => (
                  <tr key={pago.id}>
                    <td style={{ padding: '12px', color: '#a1a1aa' }}>
                      {pago.created_at ? new Date(pago.created_at).toLocaleDateString('es-PE') : '—'}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#f4f4f5' }}>S/. {Number(pago.monto).toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
                        background: pago.estado === 'pagado' ? 'rgba(52,211,153,0.15)' : pago.estado === 'rechazado' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                        color: pago.estado === 'pagado' ? '#34d399' : pago.estado === 'rechazado' ? '#f87171' : '#fbbf24',
                      }}>
                        {pago.estado?.toUpperCase() || 'PENDIENTE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
