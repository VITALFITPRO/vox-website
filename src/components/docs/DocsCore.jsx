import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DocsCore() {
  const customTheme = {
    ...vscDarkPlus,
    'code[class*="language-"]': { ...vscDarkPlus['code[class*="language-"]'], background: 'transparent' },
    'pre[class*="language-"]': { ...vscDarkPlus['pre[class*="language-"]'], background: 'transparent', margin: 0 }
  };

  return (
    <div className="docs-section">
      <h1>Wrappers UI Nativos (VoxCore)</h1>
      <p>Olvídate del Inglés. VoxCore es el motor adaptativo que traduce instantáneamente tus ideas estructurales arquitectónicas en Español, Portugués o Italiano directamente hacia las librerías ultra optimizadas de Dart y Flutter.</p>

      <h2>Diccionario de Componentes UI Trilingüe</h2>
      <p>Vox mapea automáticamente docenas de <strong>Widgets</strong> para que funcionen con variables dinámicas de estado sin re-escribir lógica (<i>State Management Transformed</i>). Aquí tienes las piezas maestras:</p>

      <table className="docs-table">
        <thead>
          <tr>
            <th>Español (ES)</th>
            <th>Portugués (PT)</th>
            <th>Italiano (IT)</th>
            <th>Flutter Nivel 1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>lista_plana</code></td>
            <td><code>lista_plana</code></td>
            <td><code>lista_piatta</code></td>
            <td><code>ListView.builder</code></td>
          </tr>
          <tr>
            <td><code>vista_desplazable</code></td>
            <td><code>vista_rolavel</code></td>
            <td><code>vista_scorrevole</code></td>
            <td><code>SingleChildScrollView</code></td>
          </tr>
          <tr>
            <td><code>navegador</code></td>
            <td><code>navegador</code></td>
            <td><code>navigatore</code></td>
            <td><code>Navigator</code></td>
          </tr>
          <tr>
            <td><code>alerta</code></td>
            <td><code>alerta</code></td>
            <td><code>avviso</code></td>
            <td><code>AlertDialog</code></td>
          </tr>
          <tr>
            <td><code>imagen_red</code></td>
            <td><code>imagem_rede</code></td>
            <td><code>immagine_rete</code></td>
            <td><code>Image.network</code></td>
          </tr>
          <tr>
            <td><code>formulario</code></td>
            <td><code>formulario</code></td>
            <td><code>modulo</code></td>
            <td><code>Form</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Almacenamiento Local (Local Storage)</h2>
      <p>Guardar preferencias del usuario en React Native (AsyncStorage) o Flutter (SharedPreferences) requería boilerplate brutal de promesas globales. En Vox, usas <strong>importar "vox:almacenamiento"</strong> y todo fluye.</p>

      <div className="code-block-wrapper">
        <div className="code-header">Español Nativo (Principal.vox)</div>
        <SyntaxHighlighter language="rust" style={customTheme}>
{`importar "vox:almacenamiento";

funcion guardar_cache() asincrona {
    variable db = asincrona PreferenciasCompartidas.instancia();
    db.guardar_texto("mi_token", "Bearer A2C...");

    variable token = db.leer_texto("mi_token");
    imprimir("Token recuperado: \$token");
}`}
        </SyntaxHighlighter>
      </div>

      <div className="info-card">
        <h4>Simetría de Traducción (--idioma=pt)</h4>
        <p>Si compilas marcando a Brasil, todas tus funciones serán <code>funcao</code> y `PreferenciasCompartidas` mutará a su equivalente lusófono (<strong>PreferenciasCompartilhadas</strong>, y su método <strong>salvar_texto</strong> en lugar de guardar).</p>
      </div>

    </div>
  );
}
