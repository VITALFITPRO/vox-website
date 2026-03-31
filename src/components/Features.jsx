// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🌎',
    title: 'Sin barrera del idioma',
    description:
      'Escribe código en español, portugués o italiano. Sin necesidad de saber inglés para programar.',
  },
  {
    icon: '📱',
    title: 'Apps reales con Flutter',
    description:
      'Vox compila a Flutter/Dart. Genera apps nativas para Android, iOS y Web desde un solo código.',
  },
  {
    icon: '🗣️',
    title: 'Multi-idioma',
    description:
      'Soporta español, portugués e italiano. Cada comunidad programa en su propio idioma.',
  },
  {
    icon: '🚀',
    title: 'Fácil de aprender',
    description:
      'Sintaxis intuitiva diseñada para principiantes. Si hablas español, ya sabes la mitad del lenguaje.',
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

export default function Features() {
  return (
    <section className="features" id="features">
      <h2 className="section-title">¿Por qué Vox?</h2>
      <p className="section-subtitle">
        Creado para que millones de hispanohablantes puedan crear tecnología
      </p>

      <div className="features-grid">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            className="feature-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
          >
            <span className="feature-icon">{feat.icon}</span>
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
