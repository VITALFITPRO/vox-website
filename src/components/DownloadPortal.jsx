import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { callEdgeFunction } from '../lib/supabase';

// ============================================================
// CONFIGURACIÓN DE PLATAFORMAS
// ============================================================
const PLATFORMS = {
  windows: { label: 'Windows', icon: '🪟', fileName: 'vox-sdk-windows.zip', size: '~45 MB' },
  mac:     { label: 'macOS',   icon: '🍎', fileName: 'vox-sdk-macos.zip',   size: '~42 MB' },
  linux:   { label: 'Linux',   icon: '🐧', fileName: 'vox-sdk-linux.tar.gz', size: '~40 MB' },
};

// Mensajes de error amigables
const ERROR_MESSAGES = {
  NO_TOKEN: 'No se proporcionó un token de descarga válido.',
  INVALID_TOKEN: 'Este enlace de descarga no es válido.',
  TOKEN_EXPIRED: 'Este enlace de descarga ha expirado. Contacta soporte para obtener uno nuevo.',
  MAX_DOWNLOADS: 'Has alcanzado el límite de descargas para este enlace.',
  ALREADY_DOWNLOADED: 'Ya descargaste esta versión desde este dispositivo.',
  STORAGE_ERROR: 'Error al generar el enlace de descarga. Intenta de nuevo.',
};

export default function DownloadPortal() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | valid | error
  const [errorMsg, setErrorMsg] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState({});
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg(ERROR_MESSAGES.NO_TOKEN);
      return;
    }
    setStatus('valid');
  }, [token]);

  const handleDownload = async (platform) => {
    if (downloading || downloaded[platform]) return;
    setDownloading(platform);

    try {
      const data = await callEdgeFunction('validate-download', { token, platform });

      if (data.download_url) {
        setDownloaded((prev) => ({ ...prev, [platform]: true }));
        if (data.remaining !== undefined) setRemaining(data.remaining);
        window.open(data.download_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      const msg = err.message || 'Error al procesar la descarga';
      // Intentar parsear respuesta JSON de la Edge Function
      try {
        const parsed = JSON.parse(msg);
        const code = parsed.code || '';
        setErrorMsg(ERROR_MESSAGES[code] || parsed.error || msg);
      } catch {
        setErrorMsg(msg);
      }
      setStatus('error');
    } finally {
      setDownloading(null);
    }
  };

  // ===== PANTALLA DE ERROR =====
  if (status === 'error') {
    return (
      <div className="download-portal">
        <div className="download-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="download-back">← Volver al inicio</Link>
            <div className="download-header">
              <img src="/vox-logo.png" alt="Vox" className="download-logo" />
              <h1>Acceso denegado</h1>
            </div>
            <div className="download-error">
              <div className="download-error-icon">⚠️</div>
              <p>{errorMsg}</p>
              <p className="download-support">
                ¿Necesitas ayuda? Escríbenos a{' '}
                <a href="mailto:serviciotecnicoarv@gmail.com">serviciotecnicoarv@gmail.com</a>
              </p>
              <Link to="/#pricing" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                Volver a precios
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== PANTALLA DE CARGA =====
  if (status === 'loading') {
    return (
      <div className="download-portal">
        <div className="download-container">
          <div className="download-loading">Verificando acceso...</div>
        </div>
      </div>
    );
  }

  // ===== PANTALLA DE DESCARGA =====
  return (
    <div className="download-portal">
      <div className="download-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="download-back">← Volver al inicio</Link>
          <div className="download-header">
            <img src="/vox-logo.png" alt="Vox" className="download-logo" />
            <h1>Descargar Vox SDK</h1>
            <p className="download-subtitle">
              Selecciona tu sistema operativo para descargar el SDK de Vox.
              <br />
              Una vez descargado, descomprime el archivo y sigue la documentación.
            </p>
            {remaining !== null && (
              <p className="download-remaining">
                Descargas restantes: <strong>{remaining}</strong>
              </p>
            )}
          </div>

          <div className="download-grid">
            {Object.entries(PLATFORMS).map(([platform, dl], i) => (
              <motion.div
                key={platform}
                className={`download-card ${downloaded[platform] ? 'downloaded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="download-os-icon">{dl.icon}</span>
                <h3>{dl.label}</h3>
                <p className="download-filename">{dl.fileName}</p>
                <p className="download-size">{dl.size}</p>

                {downloaded[platform] ? (
                  <div className="download-done">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3 4.3L6.5 11.1L2.7 7.3"
                        stroke="#4caf50"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Ya descargado
                  </div>
                ) : (
                  <button
                    className="btn-primary download-btn"
                    onClick={() => handleDownload(platform)}
                    disabled={downloading !== null}
                  >
                    {downloading === platform ? 'Generando enlace...' : 'Descargar'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="download-notes">
            <h4>Instrucciones rápidas</h4>
            <ol>
              <li>Descarga el SDK para tu sistema operativo</li>
              <li>Descomprime el archivo en una carpeta de tu elección</li>
              <li>Agrega la carpeta <code>bin</code> a tu variable PATH</li>
              <li>Ejecuta <code>vox --version</code> para verificar la instalación</li>
              <li>Activa tu licencia con <code>vox activate TU-LICENCIA</code></li>
            </ol>
            <p className="download-support">
              ¿Necesitas ayuda? Escríbenos a{' '}
              <a href="mailto:serviciotecnicoarv@gmail.com">serviciotecnicoarv@gmail.com</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
