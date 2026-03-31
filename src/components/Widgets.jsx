// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const widgets = [
  { vox: 'texto', flutter: 'Text', desc: 'Muestra texto en pantalla' },
  { vox: 'boton', flutter: 'ElevatedButton', desc: 'Botón interactivo' },
  { vox: 'imagen', flutter: 'Image', desc: 'Muestra una imagen' },
  { vox: 'columna', flutter: 'Column', desc: 'Layout vertical' },
  { vox: 'fila', flutter: 'Row', desc: 'Layout horizontal' },
  { vox: 'contenedor', flutter: 'Container', desc: 'Contenedor con estilo' },
  { vox: 'lista', flutter: 'ListView', desc: 'Lista desplazable' },
  { vox: 'entrada', flutter: 'TextField', desc: 'Campo de entrada de texto' },
  { vox: 'interruptor', flutter: 'Switch', desc: 'Control on/off' },
  { vox: 'casilla', flutter: 'Checkbox', desc: 'Casilla de verificación' },
  { vox: 'tarjeta', flutter: 'Card', desc: 'Tarjeta con elevación' },
  { vox: 'icono', flutter: 'Icon', desc: 'Muestra un ícono' },
  { vox: 'espaciador', flutter: 'SizedBox', desc: 'Espacio entre widgets' },
  { vox: 'barra', flutter: 'AppBar', desc: 'Barra superior de la app' },
  { vox: 'cajon', flutter: 'Drawer', desc: 'Menú lateral deslizable' },
  { vox: 'dialogo', flutter: 'AlertDialog', desc: 'Cuadro de diálogo emergente' },
  { vox: 'circular', flutter: 'CircularProgressIndicator', desc: 'Indicador de carga circular' },
  { vox: 'deslizador', flutter: 'Slider', desc: 'Control deslizante de valor' },
  { vox: 'radio', flutter: 'Radio', desc: 'Selector de opción única' },
  { vox: 'navegacion', flutter: 'BottomNavigationBar', desc: 'Barra de navegación inferior' },
  { vox: 'flotante', flutter: 'FloatingActionButton', desc: 'Botón de acción flotante' },
  { vox: 'cuadricula', flutter: 'GridView', desc: 'Cuadrícula de elementos' },
  { vox: 'pila', flutter: 'Stack', desc: 'Apila widgets uno sobre otro' },
  { vox: 'envoltorio', flutter: 'Wrap', desc: 'Ajuste automático de línea' },
  { vox: 'separador', flutter: 'Divider', desc: 'Línea separadora horizontal' },
];

export default function Widgets() {
  return (
    <section className="widgets" id="widgets">
      <h2 className="section-title">Widgets disponibles</h2>
      <p className="section-subtitle">
        25 widgets listos para construir cualquier interfaz
      </p>

      <motion.div
        className="table-wrapper"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <table className="widgets-table">
          <thead>
            <tr>
              <th>Vox</th>
              <th>Flutter</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {widgets.map((w) => (
              <tr key={w.vox}>
                <td><code>{w.vox}</code></td>
                <td><code>{w.flutter}</code></td>
                <td>{w.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
