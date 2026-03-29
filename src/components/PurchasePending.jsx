import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PurchasePending() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 48,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 12 }}>
          Pago pendiente
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
          Tu pago está siendo procesado. Recibirás un correo electrónico con el
          enlace de descarga una vez que se confirme el pago.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 32 }}>
          Esto puede tardar unos minutos dependiendo del método de pago.
        </p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Volver al inicio
        </Link>
      </motion.div>
    </section>
  );
}
