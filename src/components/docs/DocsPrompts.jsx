import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DocsPrompts() {
  const customTheme = { ...vscDarkPlus, 'code[class*="language-"]': { ...vscDarkPlus['code[class*="language-"]'], background: 'transparent' }, 'pre[class*="language-"]': { ...vscDarkPlus['pre[class*="language-"]'], background: 'transparent', margin: 0 } };

  const promptEspanol = `Escribe un código en el lenguaje "Vox" respetando sus reglas léxicas estrictas en español:
1. No uses clases de Flutter ni Dart, escribe 100% en el léxico oficial trilingüe.
2. Declaraciones var/const son: "variable nombre = x;" y "constante P = 3.14;"
3. El estado de la pantalla se declara en el sub-bloque "estado { ... }"
4. El árbol UI se inicia con el bloque "diseño { ... }"
5. Componentes básicos: Texto, Boton, contenedor, columna, fila, lista_plana.

Ejemplo:
pantalla Galeria {
  estado { variable fotos = 5; }
  funcion sumar() { fotos = fotos + 1; }
  diseño {
      centro {
          columna(alineacion: "centro") {
              Texto("Fotos totales: \${fotos}")
              Boton(titulo: "Tomar", al_tocar: sumar)
          }
      }
  }
}`;

  return (
    <div className="docs-section">
      <h1>Entrenando a tu Inteligencia Artificial</h1>
      <p>A diferencia de Dart o Python, donde las IAs ya conocen las reglas universales pre-entrenadas, Vox es un ecosistema moderno en tu propia lengua materna. Si deseas potenciar tu escritura de código utilizando Asistentes (ChatGPT, Gemini, Claude, Copilot, Cursor), **dales el siguiente contexto fundamental** al inicio de tus chats.</p>

      <h2>Prompt Semilla Universal</h2>
      <p>Copia y pega este Prompt Inicial (Semilla) en la caja de chat de la IA, antes de dictarle hacer algo. Este prompt inyectará las reglas sintácticas y el transpilador virtual que tu IA necesita dominar.</p>
      
      <div className="code-block-wrapper">
        <div className="code-header">
          <span>Prompt Constructor en Español</span>
          <button className="copy-btn" onClick={() => navigator.clipboard.writeText(promptEspanol)}>Copiar Prompt</button>
        </div>
        <SyntaxHighlighter language="plaintext" style={customTheme}>
          {promptEspanol}
        </SyntaxHighlighter>
      </div>

      <div className="info-card">
        <h4>Aviso de Compatibilidad IDE (Tauri)</h4>
        <p>Si estás programando desde el editor oficial EasyCode (Construido en Rust y Tauri), este Profile ya viene inyectado a la red neuronal local en la pestaña Copiloto de forma automática.</p>
      </div>
    </div>
  );
}
