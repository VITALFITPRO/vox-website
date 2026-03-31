import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIAS = ['Todas', 'UI', 'Base de datos', 'Audio/Video', 'Mapas', 'Auth', 'Utilidades'];

const LIBRERIAS_DEMO = [
  {
    id: 1, nombre: 'vox:charts', descripcion: 'Gráficas y visualizaciones de datos para apps Vox.',
    version: '1.2.0', autor: 'VoxTeam', descargas: 1240, categoria: 'UI',
  },
  {
    id: 2, nombre: 'vox:auth_google', descripcion: 'Autenticación con Google OAuth2 en una línea.',
    version: '2.0.1', autor: 'comunidad', descargas: 520, categoria: 'Auth',
  },
  {
    id: 3, nombre: 'vox:animations', descripcion: 'Animaciones predefinidas: fade, slide, bounce y más.',
    version: '1.0.5', autor: 'Carlos R.', descargas: 3410, categoria: 'UI',
  },
  {
    id: 4, nombre: 'vox:local', descripcion: 'Base de datos local SQLite para almacenamiento offline.',
    version: '1.1.0', autor: 'VoxTeam', descargas: 890, categoria: 'Base de datos',
  },
  {
    id: 5, nombre: 'vox:mapa', descripcion: 'Integración con Google Maps en apps móviles.',
    version: '0.9.3', autor: 'VoxTeam', descargas: 340, categoria: 'Mapas',
  },
  {
    id: 6, nombre: 'vox:audio', descripcion: 'Reproductor de audio con controles completos.',
    version: '1.3.2', autor: 'DJ_Code', descargas: 670, categoria: 'Audio/Video',
  },
];

function LibreriaCard({ lib, onCopiar }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    navigator.clipboard.writeText(`vox instalar ${lib.nombre}`);
    setCopiado(true);
    onCopiar?.(lib.nombre);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '700', color: '#818cf8' }}>
          {lib.nombre}
        </span>
        <span style={{ fontSize: '12px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '999px' }}>
          {lib.categoria}
        </span>
      </div>

      <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
        {lib.descripcion}
      </p>

      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#71717a' }}>
        <span>v{lib.version}</span>
        <span>por <strong style={{ color: '#a1a1aa' }}>{lib.autor}</strong></span>
        <span>⬇ {lib.descargas.toLocaleString()}</span>
      </div>

      <div style={{
        background: '#0f0f1a',
        borderRadius: '8px',
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#34d399',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>$ vox instalar {lib.nombre}</span>
        <button
          onClick={copiar}
          style={{
            background: copiado ? 'rgba(52,211,153,0.2)' : 'rgba(129,140,248,0.15)',
            border: 'none',
            borderRadius: '6px',
            color: copiado ? '#34d399' : '#818cf8',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '4px 10px',
            transition: 'all 0.2s',
          }}
        >
          {copiado ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}

export default function Directorio() {
  const [librerias, setLibrerias] = useState(LIBRERIAS_DEMO);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [toast, setToast] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchLibrerias = async () => {
      setCargando(true);
      try {
        const { data, error } = await supabase
          .from('vox_libraries')
          .select('*')
          .order('descargas', { ascending: false });
        if (!error && data && data.length > 0) setLibrerias(data);
      } catch (_) { /* usa datos demo si falla */ }
      setCargando(false);
    };
    fetchLibrerias();
  }, []);

  const filtradas = librerias.filter(lib => {
    const matchBusqueda = lib.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lib.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoria === 'Todas' || lib.categoria === categoria;
    return matchBusqueda && matchCategoria;
  });

  const mostrarToast = (nombre) => {
    setToast(`¡Instrucción de "${nombre}" copiada!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a14', color: 'white', paddingTop: '80px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: '10px', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <div style={{ fontSize: '13px', color: '#818cf8', fontWeight: '600', letterSpacing: '2px', marginBottom: '16px' }}>
          ECOSISTEMA VOX
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', margin: '0 0 16px', lineHeight: 1.1 }}>
          Directorio de{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Librerías
          </span>
        </h1>
        <p style={{ color: '#71717a', fontSize: '18px', maxWidth: '560px', margin: '0 auto' }}>
          Descubre, instala y usa librerías de la comunidad Vox con un solo comando.
        </p>
      </div>

      {/* AdSense placeholder */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '0 24px' }}>
        <div id="ads-directorio" style={{
          background: 'rgba(99,102,241,0.05)',
          border: '1px dashed rgba(99,102,241,0.2)',
          borderRadius: '12px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#52525b',
          fontSize: '13px',
        }}>
          Anuncio — Google AdSense
        </div>
      </div>

      {/* Filtros */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '0 24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Buscar librería..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: 1, minWidth: '220px', background: '#111121', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              style={{
                padding: '10px 16px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer',
                border: categoria === cat ? 'none' : '1px solid rgba(99,102,241,0.3)',
                background: categoria === cat ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                color: categoria === cat ? 'white' : '#a1a1aa',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>Cargando librerías...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
            No se encontraron librerías con esos filtros.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filtradas.map(lib => (
              <LibreriaCard key={lib.id} lib={lib} onCopiar={mostrarToast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
