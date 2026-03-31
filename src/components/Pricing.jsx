import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { callEdgeFunction } from '../lib/supabase';

const plans = [
  {
    name: 'Comunidad',
    price: 'Gratis',
    priceNote: 'para siempre',
    features: [
      'Editor online',
      'Documentación completa',
      'Comunidad en Discord',
      'Ejemplos y tutoriales',
    ],
    cta: 'Empezar gratis',
    ctaStyle: 'btn-outline',
    href: '#docs',
    highlighted: false,
    isCheckout: false,
  },
  {
    name: 'SDK',
    price: '$1 USD',
    priceNote: 'único pago · Mercado Pago',
    features: [
      'Compilador Vox completo',
      'Genera Flutter/Dart',
      'Android + iOS + Web',
      'Actualizaciones incluidas',
      'Soporte por email',
    ],
    cta: 'Comprar con Mercado Pago',
    ctaStyle: 'btn-primary',
    highlighted: true,
    isCheckout: true,
  },
  {
    name: 'Empresas',
    price: 'Contactar',
    priceNote: 'plan personalizado',
    features: [
      'Licencia comercial',
      'Soporte prioritario',
      'Capacitación de equipo',
      'Integración CI/CD',
      'SLA garantizado',
    ],
    cta: 'Contactar ventas',
    ctaStyle: 'btn-outline',
    href: 'mailto:serviciotecnicoarv@gmail.com',
    highlighted: false,
    isCheckout: false,
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

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', phone: '' });
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckoutClick = () => {
    setShowModal(true);
    setCheckoutError('');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (!checkoutData.name.trim() || !checkoutData.email.trim()) {
      setCheckoutError('Nombre y correo son requeridos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email)) {
      setCheckoutError('Correo no válido');
      return;
    }

    setCheckoutLoading(true);

    try {
      const data = await callEdgeFunction('create-checkout', {
        email: checkoutData.email,
        name: checkoutData.name,
        phone: checkoutData.phone,
      });

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.sandbox_url) {
        window.location.href = data.sandbox_url;
      } else {
        setCheckoutError('No se pudo generar el link de pago');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Error al conectar con el servidor de pagos');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section className="pricing" id="pricing">
      <h2 className="section-title">Precios simples, sin sorpresas</h2>
      <p className="section-subtitle">
        Empieza gratis o accede al SDK completo por solo $1
      </p>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
          >
            {plan.highlighted && <span className="popular-badge">Popular</span>}
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-price">{plan.price}</div>
            <span className="plan-note">{plan.priceNote}</span>

            <ul className="plan-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.3 4.3L6.5 11.1L2.7 7.3"
                      stroke="#42A5F5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {plan.isCheckout ? (
              <button className={plan.ctaStyle} onClick={handleCheckoutClick}>
                {plan.cta}
              </button>
            ) : (
              <a
                href={plan.href}
                className={plan.ctaStyle}
                target={plan.href?.startsWith('mailto') ? '_blank' : undefined}
                rel={plan.href?.startsWith('mailto') ? 'noopener noreferrer' : undefined}
              >
                {plan.cta}
              </a>
            )}
          </motion.div>
        ))}
      </div>

      <p className="pricing-note">
        💳 Pagos seguros procesados por <strong>Mercado Pago</strong>
      </p>

      {/* MODAL DE CHECKOUT */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="checkout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !checkoutLoading && setShowModal(false)}
          >
            <motion.div
              className="checkout-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="checkout-close"
                onClick={() => !checkoutLoading && setShowModal(false)}
              >
                ✕
              </button>
              <div className="checkout-header">
                <img src="/vox-logo.png" alt="Vox" style={{ width: 48, height: 48 }} />
                <h3>Comprar Vox SDK — $1 USD</h3>
                <p>Ingresa tus datos para continuar al pago seguro con Mercado Pago</p>
              </div>
              <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                />
                {checkoutError && <p className="checkout-error">{checkoutError}</p>}
                <button
                  type="submit"
                  className="btn-primary checkout-submit"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Redirigiendo a Mercado Pago...' : 'Continuar al pago'}
                </button>
              </form>
              <p className="checkout-note">
                Serás redirigido a Mercado Pago. Después del pago recibirás un email con tu enlace de descarga.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
