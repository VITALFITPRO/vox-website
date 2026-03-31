// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const logo = '/vox-logo.png';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.img
          src={logo}
          alt="Vox Logo"
          className="hero-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <h1 className="hero-title">Programa en tu idioma</h1>

        <p className="hero-subtitle">
          El primer lenguaje en español<br />
          que genera apps reales para <strong>Android</strong>, <strong>iOS</strong> y <strong>Web</strong>
        </p>

        <div className="hero-buttons">
          <a href="#pricing" className="btn-primary">
            Descargar SDK — $1 USD
          </a>
          <a href="#demo" className="btn-outline">
            Ver Documentación
          </a>
        </div>

        <div className="hero-badges">
          <span className="badge">español</span>
          <span className="badge-separator">·</span>
          <span className="badge">portugués</span>
          <span className="badge-separator">·</span>
          <span className="badge">italiano</span>
        </div>
      </motion.div>

      <div className="hero-glow" />
    </section>
  );
}
