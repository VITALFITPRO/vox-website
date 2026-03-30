import { Link } from 'react-router-dom';

export default function DocsMonetization() {
  return (
    <div className="docs-section">
      <h1>Monetiza tu Talento con VoxPub</h1>
      <p>A diferencia del monopolio gratis de NPM o el ecosistema centralizado The Pub, el corazón de programación latino Vox cree que <strong>los desarrolladores merecen vivir de sus paquetes open source</strong>.</p>

      <h2>El Reparto del 50/50: Gana por Visitas</h2>
      <p>Vox posee un modelo financiero basado en impresiones publicitarias éticas de AdSense integradas en el motor de búsqueda de <code>voxlang.dev/pub</code>.</p>
      
      <div className="info-card">
        <h4>Cómo funciona la liquidez pasiva</h4>
        <ol>
          <li>Empaquetas tu librería con el comando en consola: <code>vox publicar mi_paquete</code>.</li>
          <li>Cada vez que un usuario entre a la página de documentación de tu librería buscando ejemplos o copias de instalación, <strong>generarás ingresos publicitarios automáticos</strong>.</li>
          <li>Al final del mes, la plataforma calcula todas las impresiones y reparte el 50% neto directamente al creador de la librería y el otro 50% al mantenimiento global del ecosistema Vox.</li>
          <li>¡Pagos automáticos y sin comisiones extras enviados a tu cuenta vinculada de <strong>Mercado Pago</strong>!</li>
        </ol>
      </div>

      <h2>Vincular tu billetera (Wallet)</h2>
      <p>Para empezar a publicar y ganar tu rentabilidad de AdSense del tráfico:</p>
      <ul>
        <li>Regístrate como creador verificado conectando tu cuenta en Mercado Pago (Soporte local garantizado para Latam).</li>
        <li>Tus credenciales y saldos son administrados por Supabase con funciones perimetrales que previenen el fraude en visitas.</li>
        <li>Mira tu <strong>Dashboard de Creador</strong> en tiempo real con estadísticas de tráfico por código y gráficas completas.</li>
      </ul>

      <div style={{ marginTop: '3rem' }}>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem', background: 'var(--primary)', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
          Ir a tu Panel de Creador (Próximamente)
        </Link>
      </div>
    </div>
  );
}
