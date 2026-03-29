import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// FAQ DATA — 10 preguntas frecuentes
// Edita estas preguntas y respuestas según necesites.
// Cuando conectes el agente IA, puedes reemplazar este array
// por llamadas a tu backend/API.
// ============================================================
const FAQ_DATA = [
  {
    id: 1,
    question: '¿Qué es Vox?',
    answer:
      'Vox es el primer lenguaje de programación en español que compila a Flutter/Dart, permitiéndote crear apps reales para Android, iOS y Web escribiendo código en tu idioma.',
  },
  {
    id: 2,
    question: '¿Cuánto cuesta el SDK?',
    answer:
      'El SDK de Vox tiene un único pago de $1 USD a través de Mercado Pago. Una vez comprado, es tuyo para siempre con actualizaciones incluidas.',
  },
  {
    id: 3,
    question: '¿En qué idiomas puedo programar?',
    answer:
      'Actualmente Vox soporta español, portugués e italiano. Cada comunidad puede programar en su propio idioma con la misma sintaxis.',
  },
  {
    id: 4,
    question: '¿Necesito saber Flutter o Dart?',
    answer:
      'No. Vox se encarga de generar el código Flutter/Dart automáticamente. Tú solo escribes en cualquiera de los 3 idiomas del lenguaje Vox (español, portugués o italiano) para que puedas programar en tu propio idioma, y el compilador hace el resto.',
  },
  {
    id: 5,
    question: '¿Puedo publicar apps en Play Store y App Store?',
    answer:
      'Sí. Las apps generadas por Vox son apps Flutter nativas, por lo que puedes publicarlas en Google Play Store, Apple App Store y como apps web.',
  },
  {
    id: 6,
    question: '¿Qué es VoxPub?',
    answer:
      'VoxPub es el directorio de librerías y paquetes de Vox creados por la comunidad, en español. Estará disponible próximamente.',
  },
  {
    id: 7,
    question: '¿Vox es open source?',
    answer:
      'El compilador SDK es de pago ($1 USD), pero la documentación, ejemplos y el editor online son gratuitos y abiertos para la comunidad.',
  },
  {
    id: 8,
    question: '¿Cómo instalo el SDK?',
    answer:
      'Después de comprarlo en Mercado Pago, recibirás acceso a la página de descargas donde podrás bajar el SDK para Windows, Mac o Linux. Solo descomprime el archivo y sigue las instrucciones de la documentación.',
  },
  {
    id: 9,
    question: '¿Tienen plan para empresas?',
    answer:
      'Sí. Ofrecemos licencias comerciales con soporte prioritario, capacitación de equipo e integración CI/CD. Contáctanos para más detalles.',
  },
  {
    id: 10,
    question: '¿Dónde puedo reportar bugs o sugerir mejoras?',
    answer:
      'Puedes reportar bugs en nuestro repositorio de GitHub o unirte a nuestro servidor de Discord donde la comunidad y el equipo pueden ayudarte.',
  },
];

// ============================================================
// WHATSAPP CONFIG
// Cambia este número por el número real de WhatsApp de soporte
// ============================================================
const WHATSAPP_NUMBER = '51963524187'; // Formato: código país + número sin +
const WHATSAPP_MESSAGE = 'Hola, necesito soporte con Vox.';

// ============================================================
// CHATBOT VIEWS:
// 'bubble'   → solo el botón flotante
// 'welcome'  → formulario de contacto (nombre, email, teléfono)
// 'menu'     → menú principal (FAQ + Contactar asesor)
// 'faq-list' → lista de preguntas
// 'faq-answer' → respuesta a una pregunta
// 'contact'  → confirmación de derivación a WhatsApp
// ============================================================

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('welcome');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // ----------------------------------------------------------
  // HANDLERS
  // Cuando integres el agente IA, reemplaza estos handlers
  // por llamadas a tu API. La estructura está lista para eso.
  // ----------------------------------------------------------

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Si el usuario ya llenó el form antes, ir directo al menú
      if (userData.name && userData.email) {
        setView('menu');
      } else {
        setView('welcome');
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!userData.name.trim()) errors.name = 'Ingresa tu nombre';
    if (!userData.email.trim()) {
      errors.email = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Correo no válido';
    }
    if (!userData.phone.trim()) errors.phone = 'Ingresa tu número';
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    // -------------------------------------------------------
    // PUNTO DE INTEGRACIÓN IA:
    // Aquí puedes enviar userData a tu backend/agente IA
    // Ejemplo: await fetch('/api/chatbot/register', { body: JSON.stringify(userData) })
    // -------------------------------------------------------
    setView('menu');
  };

  const handleFaqSelect = (faq) => {
    setSelectedFaq(faq);
    // -------------------------------------------------------
    // PUNTO DE INTEGRACIÓN IA:
    // Aquí puedes registrar qué pregunta hizo el usuario
    // Ejemplo: await fetch('/api/chatbot/faq-click', { body: JSON.stringify({ userId: userData.email, faqId: faq.id }) })
    // -------------------------------------------------------
    setView('faq-answer');
  };

  const handleContactAdvisor = () => {
    // -------------------------------------------------------
    // PUNTO DE INTEGRACIÓN IA:
    // Aquí puedes notificar a tu sistema que el usuario quiere hablar con un asesor
    // Ejemplo: await fetch('/api/chatbot/request-advisor', { body: JSON.stringify(userData) })
    // -------------------------------------------------------
    setView('contact');
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `${WHATSAPP_MESSAGE}\n\nNombre: ${userData.name}\nCorreo: ${userData.email}\nTeléfono: ${userData.phone}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleBack = () => {
    if (view === 'faq-answer') setView('faq-list');
    else if (view === 'faq-list' || view === 'contact') setView('menu');
    else setView('menu');
  };

  // ----------------------------------------------------------
  // RENDER HELPERS
  // ----------------------------------------------------------

  const renderWelcome = () => (
    <div className="chat-view">
      <div className="chat-header-section">
        <img src="/vox-logo.png" alt="Vox" className="chat-avatar" />
        <h3>¡Hola! Soy el asistente de Vox</h3>
        <p>Para brindarte mejor soporte, necesitamos tus datos:</p>
      </div>
      <form className="chat-form" onSubmit={handleFormSubmit}>
        <div className="chat-field">
          <input
            type="text"
            placeholder="Tu nombre"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          {formErrors.name && <span className="chat-error">{formErrors.name}</span>}
        </div>
        <div className="chat-field">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          {formErrors.email && <span className="chat-error">{formErrors.email}</span>}
        </div>
        <div className="chat-field">
          <input
            type="tel"
            placeholder="Tu número de teléfono"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
          {formErrors.phone && <span className="chat-error">{formErrors.phone}</span>}
        </div>
        <button type="submit" className="chat-btn-primary">
          Comenzar chat
        </button>
      </form>
    </div>
  );

  const renderMenu = () => (
    <div className="chat-view">
      <div className="chat-header-section">
        <img src="/vox-logo.png" alt="Vox" className="chat-avatar" />
        <h3>Hola, {userData.name} 👋</h3>
        <p>¿En qué podemos ayudarte?</p>
      </div>
      <div className="chat-menu-options">
        <button className="chat-menu-btn" onClick={() => setView('faq-list')}>
          <span className="chat-menu-icon">❓</span>
          <div>
            <strong>Preguntas frecuentes</strong>
            <small>Resuelve tus dudas al instante</small>
          </div>
        </button>
        <button className="chat-menu-btn" onClick={handleContactAdvisor}>
          <span className="chat-menu-icon">💬</span>
          <div>
            <strong>Contactar a un asesor</strong>
            <small>Te conectamos por WhatsApp</small>
          </div>
        </button>
      </div>
    </div>
  );

  const renderFaqList = () => (
    <div className="chat-view">
      <button className="chat-back-btn" onClick={handleBack}>
        ← Volver al menú
      </button>
      <h4 className="chat-section-title">Preguntas frecuentes</h4>
      <div className="chat-faq-list">
        {FAQ_DATA.map((faq) => (
          <button
            key={faq.id}
            className="chat-faq-item"
            onClick={() => handleFaqSelect(faq)}
          >
            <span className="faq-number">{faq.id}</span>
            {faq.question}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFaqAnswer = () => (
    <div className="chat-view">
      <button className="chat-back-btn" onClick={handleBack}>
        ← Volver a preguntas
      </button>
      {selectedFaq && (
        <div className="chat-faq-answer">
          <div className="chat-bubble user">
            {selectedFaq.question}
          </div>
          <div className="chat-bubble bot">
            <img src="/vox-logo.png" alt="" className="bubble-avatar" />
            <div className="bubble-text">{selectedFaq.answer}</div>
          </div>
        </div>
      )}
      <div className="chat-faq-footer">
        <p>¿Necesitas más ayuda?</p>
        <button className="chat-btn-secondary" onClick={handleContactAdvisor}>
          Contactar a un asesor
        </button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="chat-view">
      <button className="chat-back-btn" onClick={handleBack}>
        ← Volver al menú
      </button>
      <div className="chat-contact">
        <div className="chat-contact-icon">📱</div>
        <h3>Conectar con un asesor</h3>
        <p>
          Te redirigiremos a WhatsApp para que un asesor del equipo Vox
          te atienda personalmente.
        </p>
        <div className="chat-contact-info">
          <p><strong>Datos de contacto:</strong></p>
          <p>📧 serviciotecnicoarv@gmail.com</p>
          <p>📞 963524187</p>
        </div>
        <button className="chat-btn-whatsapp" onClick={openWhatsApp}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Abrir WhatsApp
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'welcome': return renderWelcome();
      case 'menu': return renderMenu();
      case 'faq-list': return renderFaqList();
      case 'faq-answer': return renderFaqAnswer();
      case 'contact': return renderContact();
      default: return renderMenu();
    }
  };

  return (
    <>
      {/* FLOATING BUBBLE */}
      <motion.button
        className="chatbot-bubble"
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir chat de soporte"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="bubble-icon"
            >
              ✕
            </motion.span>
          ) : (
            <motion.img
              key="chat"
              src="/vox-logo.png"
              alt="Vox"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bubble-logo"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <img src="/vox-logo.png" alt="Vox" className="chatbot-header-logo" />
                <div>
                  <strong>Soporte Vox</strong>
                  <span className="chatbot-status">🟢 En línea</span>
                </div>
              </div>
              <button className="chatbot-close" onClick={handleToggle}>✕</button>
            </div>

            <div className="chatbot-body">
              {renderView()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
