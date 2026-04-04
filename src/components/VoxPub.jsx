// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { LIBRERIAS_CORE, LIBRERIAS_TERCEROS } from '../data/librerias';

// 2 core destacadas + 2 comunidad populares
const destacadas = [
  LIBRERIAS_CORE.find(l => l.id === 'core-red'),
  LIBRERIAS_CORE.find(l => l.id === 'core-firebase'),
  LIBRERIAS_TERCEROS.find(l => l.id === 'vox-estado-provider'),
  LIBRERIAS_TERCEROS.find(l => l.id === 'vox-grafica-lineas'),
].filter(Boolean);

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export default function VoxPub() {
  return (
    <section className="voxpub" id="voxpub">
      <h2 className="section-title">VoxPub {'\u2014'} Librerias en tu idioma</h2>
      <p className="section-subtitle">
        30 librerias core + 24 de la comunidad. Todo en espa{'\u00F1'}ol, todo con un solo comando.
      </p>

      <div className="voxpub-grid">
        {destacadas.map((lib, i) => (
          <motion.div
            key={lib.id}
            className="voxpub-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
          >
            <div className="voxpub-card-header">
              <code className="lib-name">{lib.nombre_vox}</code>
              <span className="lib-version">v{lib.version}</span>
            </div>
            <p className="lib-desc">{lib.descripcion_corta}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="lib-author">por @{lib.autor}</span>
              <span style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '999px',
                background: lib.categoria === 'Core' ? 'rgba(52,211,153,0.15)' : 'rgba(99,102,241,0.15)',
                color: lib.categoria === 'Core' ? '#34d399' : '#818cf8',
                fontWeight: '600',
              }}>
                {lib.categoria === 'Core' ? 'Core' : 'Comunidad'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <a href="/directorio" style={{
        display: 'inline-block', marginTop: '32px',
        color: '#818cf8', fontSize: '16px', fontWeight: '600',
        textDecoration: 'none', transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
        onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
      >
        Ver todo el directorio {'\u2192'}
      </a>
    </section>
  );
}
