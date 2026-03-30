import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './Docs.css';

export default function DocsLayout() {
  const { pathname } = useLocation();

  const menu = [
    { path: '/docs', label: '1. Instalación y Configuración' },
    { path: '/docs/core', label: '2. Wrappers UI Nativos' },
    { path: '/docs/creadores', label: '3. Programa de Creadores (Gana el 50%)' },
    { path: '/docs/ia', label: '4. Entrenar Inteligencia Artificial' },
  ];

  return (
    <div className="docs-page">
      <Navbar />
      <div className="docs-container">
        <aside className="docs-sidebar">
          <div className="sidebar-header">
            <h3>Documentación</h3>
            <span className="badge">v0.1.0</span>
          </div>
          <nav>
            <ul>
              {menu.map(item => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={pathname === item.path ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="docs-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
