import { useState, useEffect } from 'react';
import { callEdgeFunction } from '../lib/supabase';
import { TODAS_LAS_LIBRERIAS, CATEGORIAS } from '../data/librerias';

function LibreriaCard({ lib, onCopiar }) {
  const [copiado, setCopiado] = useState(false);
  const esCore = lib.categoria === 'Core';
  const nombre = lib.nombre_vox || lib.nombre;
  const comandoInstalar = esCore ? lib.instalacion : `vox instalar ${nombre}`;

  const copiar = () => {
    navigator.clipboard.writeText(comandoInstalar);
    setCopiado(true);
    onCopiar?.(nombre);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: esCore ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(99,102,241,0.3)',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = esCore ? '0 12px 32px rgba(52,211,153,0.2)' : '0 12px 32px rgba(99,102,241,0.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Header: nombre + badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '700', color: esCore ? '#34d399' : '#818cf8' }}>
          {nombre}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            fontSize: '11px',
            background: esCore ? 'rgba(52,211,153,0.15)' : 'rgba(99,102,241,0.15)',
            color: esCore ? '#34d399' : '#818cf8',
            padding: '2px 8px', borderRadius: '999px', fontWeight: '600',
          }}>
            {esCore ? 'Core' : 'Comunidad'}
          </span>
          <span style={{ fontSize: '11px', background: 'rgba(99,102,241,0.1)', color: '#a1a1aa', padding: '2px 8px', borderRadius: '999px' }}>
            {lib.categoria}
          </span>
        </div>
      </div>

      {/* nombre_flutter (nombre original en ingles) */}
      {lib.nombre_flutter && (
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#52525b' }}>
          Flutter: {lib.nombre_flutter}
        </div>
      )}

      <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
        {lib.descripcion_corta || lib.descripcion}
      </p>

      {/* Meta: version, autor, descargas, fecha */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#71717a' }}>
        <span>v{lib.version}</span>
        <span>por <strong style={{ color: '#a1a1aa' }}>{lib.autor}</strong></span>
        {lib.descargas_mes != null && <span>{'\u2B07'} {lib.descargas_mes.toLocaleString()}</span>}
        {lib.ultima_actualizacion && (
          <span title="Ultima actualizacion">{'\uD83D\uDCC5'} {lib.ultima_actualizacion}</span>
        )}
      </div>

      {/* Plataformas */}
      {lib.plataformas && lib.plataformas.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {lib.plataformas.map(p => (
            <span key={p} style={{
              fontSize: '10px', background: 'rgba(255,255,255,0.05)',
              color: '#71717a', padding: '2px 6px', borderRadius: '4px',
            }}>{p}</span>
          ))}
        </div>
      )}

      {/* Comando de instalacion */}
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
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
          $ {comandoInstalar}
        </span>
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
            flexShrink: 0,
          }}
        >
          {copiado ? '\u2713 Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}

export default function Directorio() {
  const [librerias, setLibrerias] = useState(TODAS_LAS_LIBRERIAS);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [toast, setToast] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchLibrerias = async () => {
      setCargando(true);
      try {
        const result = await callEdgeFunction('buscar-libreria', { query: '', limit: 100 });
        if (result?.libraries && result.libraries.length > 0) {
          setLibrerias([...TODAS_LAS_LIBRERIAS, ...result.libraries]);
        }
      } catch (e) { /* usa datos locales si falla */ }
      setCargando(false);
    };
    fetchLibrerias();
  }, []);

  const filtradas = librerias.filter(lib => {
    const nombre = lib.nombre_vox || lib.nombre || '';
    const desc = lib.descripcion_corta || lib.descripcion || '';
    const flutter = lib.nombre_flutter || '';
    const matchBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      desc.toLowerCase().includes(busqueda.toLowerCase()) ||
      flutter.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoria === 'Todas' || lib.categoria === categoria;
    return matchBusqueda && matchCategoria;
  });

  const mostrarToast = (nombre) => {
    setToast(`Instruccion de "${nombre}" copiada!`);
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
          {'\u2713'} {toast}
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
            Librerias
          </span>
        </h1>
        <p style={{ color: '#71717a', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          {TODAS_LAS_LIBRERIAS.length} librerias disponibles — 30 del compilador y {TODAS_LAS_LIBRERIAS.length - 30} de la comunidad. Instala con un solo comando.
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
          placeholder="Buscar libreria, funcion o paquete Flutter..."
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
                background: categoria === cat
                  ? (cat === 'Core' ? 'linear-gradient(135deg, #059669, #34d399)' : 'linear-gradient(135deg, #6366f1, #818cf8)')
                  : 'transparent',
                color: categoria === cat ? 'white' : '#a1a1aa',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 16px', padding: '0 24px', fontSize: '13px', color: '#52525b' }}>
        {filtradas.length} libreria{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>Cargando librerias...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
            No se encontraron librerias con esos filtros.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filtradas.map(lib => (
              <LibreriaCard key={lib.id} lib={lib} onCopiar={mostrarToast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
