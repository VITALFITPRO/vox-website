import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeExamples = {
  Español: `componente Saludo {
  variable nombre = "Mundo"

  vista {
    columna {
      texto("¡Hola {nombre}!", tamaño: 28)
      entrada(valor: nombre, pista: "Tu nombre")
      boton("Saludar", alPresionar: () => {
        nombre = "Comunidad Vox"
      })
    }
  }
}`,
  Português: `componente Saudação {
  variável nome = "Mundo"

  vista {
    coluna {
      texto("Olá {nome}!", tamanho: 28)
      entrada(valor: nome, dica: "Seu nome")
      botão("Saudar", aoPresionar: () => {
        nome = "Comunidade Vox"
      })
    }
  }
}`,
  Italiano: `componente Saluto {
  variabile nome = "Mondo"

  vista {
    colonna {
      testo("Ciao {nome}!", dimensione: 28)
      ingresso(valore: nome, suggerimento: "Il tuo nome")
      pulsante("Salutare", alPremere: () => {
        nome = "Comunità Vox"
      })
    }
  }
}`,
};

const tabs = Object.keys(codeExamples);

export default function MultiLanguage() {
  const [active, setActive] = useState('Español');

  return (
    <section className="multilang" id="multilang">
      <h2 className="section-title">Un lenguaje, muchos idiomas</h2>
      <p className="section-subtitle">
        El mismo programa escrito en español, portugués e italiano
      </p>

      <div className="lang-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`lang-tab ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="lang-code-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="code-header">
            <div className="code-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="code-filename">
              saludo.vox — {active}
            </span>
          </div>
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 12px 12px',
              padding: '24px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: '#1a1a2e',
            }}
            codeTagProps={{
              style: { fontFamily: "'JetBrains Mono', monospace" },
            }}
          >
            {codeExamples[active]}
          </SyntaxHighlighter>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
