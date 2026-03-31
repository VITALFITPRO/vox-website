import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DocsInstall() {
  const customTheme = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'transparent',
      margin: 0,
    }
  };

  return (
    <div className="docs-section">
      <h1>Instalación y Configuración</h1>
      <p>Aprende a instalar el lenguaje de programación Vox en tu sistema Windows usando nuestro instalador oficial y crea tu primer proyecto al instante.</p>

      <h2>1. Descargar Native Vox SDK</h2>
      <p>El Vox SDK contiene el compilador, las librerías Core y el CLI completo empaquetado y listo para desarrollo nativo.</p>
      <div className="info-card">
        <h4>Requisitos del Sistema</h4>
        <p>Windows 10 o Windows 11 (Arquitectura x64). Requiere tener instaladas las herramientas de distribución nativa de Dart/Flutter (si planeas emular en Android).</p>
      </div>

      <h2>2. Ejecutar Instalador Inno Setup</h2>
      <p>Una vez descargado `VoxSetup.exe`, ejecútalo. El proceso de instalación automáticamente agregará el binario `vox.exe` al <strong>PATH</strong> de tu sistema, para que puedas ejecutar compilaciones en cualquier terminal (CMD, PowerShell, Git Bash).</p>

      <h2>3. Tu Primer "Hola Mundo"</h2>
      <p>Abre una terminal y ejecuta el comando de creación rápida para inicializar tu entorno estructurado:</p>
      
      <div className="code-block-wrapper">
        <div className="code-header">Terminal / Ejecución Mágica</div>
        <SyntaxHighlighter language="bash" style={customTheme}>
{`> vox nuevo mi_app
> cd mi_app`}
        </SyntaxHighlighter>
      </div>

      <p>Por defecto, Vox generará el archivo `src/principal.vox`. Ábrelo y empezarás a programar en español con los 3 pilares del lenguaje (Variables, Diseño y Estado):</p>
      
      <div className="code-block-wrapper">
        <div className="code-header">src/principal.vox</div>
        <SyntaxHighlighter language="rust" style={customTheme}>
{`importar "vox:mate";

pantalla Principal {
    estado {
        variable clicks = 0;
    }

    funcion incrementar() {
        clicks = clicks + 1;
        imprimir("Click número ${'$'}clicks");
    }

    diseño {
        centro {
            columna(alineacion: "centro") {
                Texto("Has tocado el botón ${'$'}clicks veces")
                Boton(titulo: "Agregar +1", al_tocar: incrementar)
            }
        }
    }
}`}
        </SyntaxHighlighter>
      </div>

      <h2>4. Compilar a Dart/Flutter</h2>
      <p>Una vez que escribas tu código en Vox, conviértelo en un proyecto multiplataforma invocando el compilador local:</p>

      <div className="code-block-wrapper">
        <div className="code-header">Transpilando</div>
        <SyntaxHighlighter language="bash" style={customTheme}>
{`> vox compilar --modo=dev`}
        </SyntaxHighlighter>
      </div>
      
      <p>El argumento <strong>--modo=dev</strong> inyecta automáticamente Source Maps. Si tu aplicación alguna vez tiene un error durante la ejecución en tu móvil, el error indicará exactamente en qué línea de tu código <code>.vox</code> sucedió, en lugar de enviarte al ininteligible código Dart transpilado.</p>
    </div>
  );
}
