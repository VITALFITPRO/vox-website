import { useState, useEffect, useCallback } from 'react';
import { callEdgeFunction } from '../lib/supabase';
import './AdminPanel.css';

const TABS = [
  { id: 'summary', label: 'Resumen', icon: '📊' },
  { id: 'purchases', label: 'Compras', icon: '💳' },
  { id: 'licenses', label: 'Licencias', icon: '🔑' },
  { id: 'tokens', label: 'Tokens', icon: '🎟️' },
  { id: 'libraries', label: 'Librerías', icon: '📦' },
  { id: 'developers', label: 'Developers', icon: '👨‍💻' },
  { id: 'payouts', label: 'Pagos', icon: '💸' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminPanel() {
  const [adminKey, setAdminKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const fetchData = useCallback(async (action, extraParams = {}) => {
    setLoading(true);
    setActionMsg('');
    try {
      const result = await callEdgeFunction('admin-dashboard', {
        action,
        admin_key: adminKey,
        ...extraParams,
      });
      setData(result);
    } catch (err) {
      setActionMsg('Error: ' + err.message);
    }
    setLoading(false);
  }, [adminKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const result = await callEdgeFunction('admin-dashboard', {
        action: 'summary',
        admin_key: adminKey,
      });
      if (result.error) {
        setLoginError(result.error);
      } else {
        setIsLoggedIn(true);
        setData(result);
      }
    } catch (err) {
      setLoginError('Clave incorrecta o servidor no disponible');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(activeTab === 'summary' ? 'summary' : activeTab);
    }
  }, [activeTab, isLoggedIn, fetchData]);

  const handleAction = async (action, params) => {
    try {
      const result = await callEdgeFunction('admin-dashboard', {
        action,
        admin_key: adminKey,
        ...params,
      });
      setActionMsg(result.message || result.error || 'Hecho');
      // Refrescar datos
      fetchData(activeTab === 'summary' ? 'summary' : activeTab);
    } catch (err) {
      setActionMsg('Error: ' + err.message);
    }
  };

  // ─── LOGIN SCREEN ─────────────────────────────────────
  if (!isLoggedIn) return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <div className="admin-login-icon">🔐</div>
        <h1>Panel de Administración</h1>
        <p>Ingresa tu clave de administrador</p>
        <input
          type="password"
          placeholder="ADMIN_SECRET_KEY"
          value={adminKey}
          onChange={e => setAdminKey(e.target.value)}
          required
          autoFocus
        />
        <button type="submit">Acceder</button>
        {loginError && <p className="admin-login-error">{loginError}</p>}
      </form>
    </div>
  );

  // ─── DASHBOARD ────────────────────────────────────────
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">⚡</span>
          <span>Vox Admin</span>
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
        <button className="admin-tab admin-logout" onClick={() => { setIsLoggedIn(false); setAdminKey(''); }}>
          <span>🚪</span> Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>{TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}</h2>
          <button className="admin-refresh" onClick={() => fetchData(activeTab === 'summary' ? 'summary' : activeTab)}>
            🔄 Refrescar
          </button>
        </header>

        {actionMsg && <div className="admin-action-msg">{actionMsg}</div>}

        {loading ? (
          <div className="admin-loading">Cargando...</div>
        ) : (
          <div className="admin-content">
            {activeTab === 'summary' && data && <SummaryView data={data} />}
            {activeTab === 'purchases' && data?.purchases && <PurchasesView data={data.purchases} />}
            {activeTab === 'licenses' && data?.licenses && <LicensesView data={data.licenses} onAction={handleAction} />}
            {activeTab === 'tokens' && data?.tokens && <TokensView data={data.tokens} />}
            {activeTab === 'libraries' && data?.libraries && <LibrariesView data={data.libraries} />}
            {activeTab === 'developers' && data?.developers && <DevelopersView data={data.developers} />}
            {activeTab === 'payouts' && data?.payouts && <PayoutsView data={data.payouts} onAction={handleAction} />}
            {activeTab === 'analytics' && data?.analytics && <AnalyticsView data={data.analytics} />}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── SUB-VIEWS ──────────────────────────────────────────

function SummaryView({ data }) {
  const cards = [
    { label: 'Ventas', value: data.total_purchases, color: '#818cf8' },
    { label: 'Ingresos', value: `S/. ${(data.total_revenue || 0).toFixed(2)}`, color: '#34d399' },
    { label: 'Licencias', value: data.total_licenses, color: '#60a5fa' },
    { label: 'Licencias Activas', value: data.active_licenses, color: '#fbbf24' },
    { label: 'Librerías', value: data.total_libraries, color: '#f472b6' },
    { label: 'Developers', value: data.total_developers, color: '#a78bfa' },
    { label: 'Visitas', value: (data.total_pageviews || 0).toLocaleString(), color: '#fb923c' },
  ];

  return (
    <div className="admin-summary-grid">
      {cards.map((c, i) => (
        <div key={i} className="admin-stat-card" style={{ borderLeftColor: c.color }}>
          <span className="admin-stat-label">{c.label}</span>
          <span className="admin-stat-value" style={{ color: c.color }}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

function PurchasesView({ data }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>Monto</th><th>Estado</th><th>MP ID</th><th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td className="mono">{p.id?.slice(0, 8)}</td>
              <td>{p.buyer_email || '—'}</td>
              <td>S/. {(p.amount || 0).toFixed(2)}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="mono">{p.mp_payment_id || '—'}</td>
              <td>{fmtDate(p.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin compras registradas</p>}
    </div>
  );
}

function LicensesView({ data, onAction }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Clave</th><th>Hardware</th><th>Activa</th><th>Activación</th><th>Creada</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(l => (
            <tr key={l.id}>
              <td className="mono">{l.license_key}</td>
              <td className="mono">{l.hardware_id ? l.hardware_id.slice(0, 16) + '...' : '—'}</td>
              <td><StatusBadge status={l.is_active ? 'active' : 'revoked'} /></td>
              <td>{l.activated_at ? fmtDate(l.activated_at) : '—'}</td>
              <td>{fmtDate(l.created_at)}</td>
              <td className="admin-actions">
                {l.is_active ? (
                  <button className="btn-danger-sm" onClick={() => onAction('revoke', { license_id: l.id })}>
                    Revocar
                  </button>
                ) : (
                  <button className="btn-success-sm" onClick={() => onAction('reactivate', { license_id: l.id })}>
                    Reactivar
                  </button>
                )}
                {l.hardware_id && (
                  <button className="btn-warn-sm" onClick={() => onAction('reset_hardware', { license_id: l.id })}>
                    Reset HW
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin licencias</p>}
    </div>
  );
}

function TokensView({ data }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Token</th><th>Descargas</th><th>Expira</th><th>Creado</th>
          </tr>
        </thead>
        <tbody>
          {data.map(t => (
            <tr key={t.id}>
              <td className="mono">{t.token?.slice(0, 12)}...</td>
              <td>{t.downloads_used}/{t.max_downloads}</td>
              <td>{fmtDate(t.expires_at)}</td>
              <td>{fmtDate(t.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin tokens</p>}
    </div>
  );
}

function LibrariesView({ data }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Paquete</th><th>Versión</th><th>Autor</th><th>Descargas</th><th>Creado</th>
          </tr>
        </thead>
        <tbody>
          {data.map(l => (
            <tr key={l.id}>
              <td className="mono">{l.nombre_paquete}</td>
              <td>{l.version_actual}</td>
              <td>{l.autor_email || '—'}</td>
              <td>{(l.downloads_count || 0).toLocaleString()}</td>
              <td>{fmtDate(l.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin librerías</p>}
    </div>
  );
}

function DevelopersView({ data }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>MP Wallet</th><th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.nombre || '—'}</td>
              <td>{d.email}</td>
              <td className="mono">{d.mercadopago_wallet_id || '—'}</td>
              <td>{fmtDate(d.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin developers</p>}
    </div>
  );
}

function PayoutsView({ data, onAction }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Monto</th><th>Estado</th><th>Wallet</th><th>Solicitado</th><th>Procesado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td>S/. {Number(p.monto).toFixed(2)}</td>
              <td><StatusBadge status={p.estado} /></td>
              <td className="mono">{p.mercadopago_wallet_id || '—'}</td>
              <td>{fmtDate(p.created_at)}</td>
              <td>{p.processed_at ? fmtDate(p.processed_at) : '—'}</td>
              <td>
                {p.estado === 'pendiente' && (
                  <button className="btn-success-sm" onClick={() => onAction('payout_approve', { payout_id: p.id })}>
                    Aprobar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="admin-empty">Sin solicitudes de pago</p>}
    </div>
  );
}

function AnalyticsView({ data }) {
  // Agrupar por ruta
  const routeCounts = {};
  data.forEach(a => {
    const route = a.page_path || a.route || '/';
    routeCounts[route] = (routeCounts[route] || 0) + 1;
  });

  const sorted = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="admin-analytics-summary">
        <div className="admin-stat-card" style={{ borderLeftColor: '#818cf8' }}>
          <span className="admin-stat-label">Eventos recientes</span>
          <span className="admin-stat-value">{data.length}</span>
        </div>
        <div className="admin-stat-card" style={{ borderLeftColor: '#34d399' }}>
          <span className="admin-stat-label">Rutas únicas</span>
          <span className="admin-stat-value">{sorted.length}</span>
        </div>
      </div>

      <h3 style={{ color: '#a1a1aa', margin: '24px 0 12px', fontSize: '14px' }}>Páginas más visitadas</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Ruta</th><th>Visitas</th></tr></thead>
          <tbody>
            {sorted.map(([route, count]) => (
              <tr key={route}>
                <td className="mono">{route}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── HELPERS ────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    approved: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', text: 'APROBADO' },
    pending: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', text: 'PENDIENTE' },
    pendiente: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', text: 'PENDIENTE' },
    pagado: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', text: 'PAGADO' },
    rechazado: { bg: 'rgba(248,113,113,0.15)', color: '#f87171', text: 'RECHAZADO' },
    active: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', text: 'ACTIVA' },
    revoked: { bg: 'rgba(248,113,113,0.15)', color: '#f87171', text: 'REVOCADA' },
    rejected: { bg: 'rgba(248,113,113,0.15)', color: '#f87171', text: 'RECHAZADO' },
  };
  const s = map[status] || { bg: 'rgba(161,161,170,0.15)', color: '#a1a1aa', text: status || '—' };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700',
      background: s.bg, color: s.color,
    }}>
      {s.text}
    </span>
  );
}

function fmtDate(str) {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return str;
  }
}
