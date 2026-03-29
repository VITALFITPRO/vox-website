import { useState } from 'react';
import { motion } from 'framer-motion';
const logo = '/vox-logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-inner">
        <a href="#" className="navbar-brand">
          <img src={logo} alt="Vox" className="navbar-logo" />
          <span>Vox</span>
        </a>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
        </button>

        <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#demo">Demo</a></li>
          <li><a href="#features">Características</a></li>
          <li><a href="#widgets">Widgets</a></li>
          <li><a href="#voxpub">Directorio</a></li>
          <li><a href="#docs" className="nav-btn-outline">Docs</a></li>
          <li><a href="#pricing" className="nav-btn-primary">Descargar</a></li>
        </ul>
      </div>
    </motion.nav>
  );
}
