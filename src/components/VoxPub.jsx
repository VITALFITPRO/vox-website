// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const libraries = [
  {
    name: 'vox_http',
    author: 'equipo-vox',
    description: 'Cliente HTTP para hacer peticiones GET, POST y más desde Vox.',
    version: '1.0.0',
  },
  {
    name: 'vox_auth',
    author: 'comunidad',
    description: 'Autenticación con Google, Apple y correo electrónico.',
    version: '0.9.2',
  },
  {
    name: 'vox_graficas',
    author: 'datavox',
    description: 'Gráficas de barras, líneas y circulares para dashboards.',
    version: '0.8.1',
  },
];

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
      <h2 className="section-title">VoxPub — Librerías en tu idioma</h2>
      <span className="coming-soon-badge">Próximamente</span>
      <p className="section-subtitle">
        Un directorio de paquetes creados por la comunidad, en español
      </p>

      <div className="voxpub-grid">
        {libraries.map((lib, i) => (
          <motion.div
            key={lib.name}
            className="voxpub-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
          >
            <div className="voxpub-card-header">
              <code className="lib-name">{lib.name}</code>
              <span className="lib-version">v{lib.version}</span>
            </div>
            <p className="lib-desc">{lib.description}</p>
            <span className="lib-author">por @{lib.author}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
