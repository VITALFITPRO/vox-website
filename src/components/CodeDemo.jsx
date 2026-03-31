// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const voxCode = `componente MiApp {
  variable contador = 0

  funcion incrementar() {
    contador = contador + 1
  }

  vista {
    columna {
      texto("Hola Mundo", tamaño: 24)
      texto("Contador: {contador}", color: azul)
      
      fila {
        boton("Sumar", alPresionar: incrementar)
        boton("Reiniciar", alPresionar: () => {
          contador = 0
        })
      }

      si (contador > 10) {
        texto("¡Meta alcanzada!", color: verde)
      }
    }
  }
}`;

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

export default function CodeDemo() {
  return (
    <section className="code-demo" id="demo">
      <h2 className="section-title">Escribe código como hablas</h2>
      <p className="section-subtitle">
        Vox traduce tu código en español a apps nativas reales
      </p>

      <div className="code-demo-grid">
        <motion.div
          className="code-panel"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="code-header">
            <div className="code-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="code-filename">mi_app.vox</span>
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
            {voxCode}
          </SyntaxHighlighter>
        </motion.div>

        <motion.div
          className="preview-panel"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="app-preview">
                <p className="preview-title">Hola Mundo</p>
                <p className="preview-counter">Contador: <span>3</span></p>
                <div className="preview-buttons">
                  <button className="preview-btn primary">Sumar</button>
                  <button className="preview-btn secondary">Reiniciar</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
