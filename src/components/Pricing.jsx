import { motion } from 'framer-motion';

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
    // Al comprar, redirige a la página de descargas
    href: '/descargar',
    highlighted: true,
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
    href: 'mailto:contacto@voxlang.com',
    highlighted: false,
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

            <a
              href={plan.href}
              className={plan.ctaStyle}
              target={plan.href.startsWith('http') ? '_blank' : undefined}
              rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {plan.cta}
            </a>
          </motion.div>
        ))}
      </div>

      <p className="pricing-note">
        💳 Pagos seguros procesados por <strong>Mercado Pago</strong>
      </p>
    </section>
  );
}
