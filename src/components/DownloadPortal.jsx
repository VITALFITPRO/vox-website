import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// CONFIGURACIÓN DE DESCARGAS
// Reemplaza estas URLs con los enlaces reales de descarga
// ============================================================
const DOWNLOADS = {
  windows: {
    label: 'Windows',
    icon: '🪟',
    fileName: 'vox-sdk-windows.zip',
    url: '#', // Reemplaza con URL real
    size: '~45 MB',
  },
  mac: {
    label: 'macOS',
    icon: '🍎',
    fileName: 'vox-sdk-macos.zip',
    url: '#', // Reemplaza con URL real
    size: '~42 MB',
  },
  linux: {
    label: 'Linux',
    icon: '🐧',
    fileName: 'vox-sdk-linux.tar.gz',
    url: '#', // Reemplaza con URL real
    size: '~40 MB',
  },
};

// ============================================================
// PROTECCIÓN DE DESCARGA — Control por IP
// Se obtiene la IP del usuario y se guarda en localStorage.
// Si la misma IP ya descargó, se bloquea la descarga.
// Para protección real en producción, implementa esta
// lógica en tu backend con una base de datos.
// ============================================================

const STORAGE_KEY = 'vox_download_record';

async function getUserIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return null;
  }
}

function getDownloadRecord() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDownloadRecord(record) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export default function DownloadPortal() {
  const [userIP, setUserIP] = useState(null);
  const [downloaded, setDownloaded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const ip = await getUserIP();
      setUserIP(ip);
      const record = getDownloadRecord();
      if (ip && record[ip]) {
        setDownloaded(record[ip]);
      }
      setLoading(false);
    })();
  }, []);

  const handleDownload = (platform) => {
    if (!userIP) return;
    const record = getDownloadRecord();
    if (record[userIP] && record[userIP][platform]) return;

    // Registrar descarga
    if (!record[userIP]) record[userIP] = {};
    record[userIP][platform] = Date.now();
    saveDownloadRecord(record);
    setDownloaded({ ...record[userIP] });

    // Iniciar descarga
    const dl = DOWNLOADS[platform];
    if (dl.url && dl.url !== '#') {
      const a = document.createElement('a');
      a.href = dl.url;
      a.download = dl.fileName;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const alreadyDownloaded = (platform) => {
    return !!(downloaded && downloaded[platform]);
  };

  return (
    <div className="download-portal">
      <div className="download-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="/" className="download-back">← Volver al inicio</a>
          <div className="download-header">
            <img src="/vox-logo.png" alt="Vox" className="download-logo" />
            <h1>Descargar Vox SDK</h1>
            <p className="download-subtitle">
              Selecciona tu sistema operativo para descargar el SDK de Vox.
              <br />
              Una vez descargado, descomprime el archivo y sigue la documentación.
            </p>
          </div>

          {loading ? (
            <div className="download-loading">Verificando acceso...</div>
          ) : (
            <div className="download-grid">
              {Object.entries(DOWNLOADS).map(([platform, dl], i) => (
                <motion.div
                  key={platform}
                  className={`download-card ${alreadyDownloaded(platform) ? 'downloaded' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="download-os-icon">{dl.icon}</span>
                  <h3>{dl.label}</h3>
                  <p className="download-filename">{dl.fileName}</p>
                  <p className="download-size">{dl.size}</p>

                  {alreadyDownloaded(platform) ? (
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
                    >
                      Descargar
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="download-notes">
            <h4>Instrucciones rápidas</h4>
            <ol>
              <li>Descarga el SDK para tu sistema operativo</li>
              <li>Descomprime el archivo en una carpeta de tu elección</li>
              <li>Agrega la carpeta <code>bin</code> a tu variable PATH</li>
              <li>Ejecuta <code>vox --version</code> para verificar la instalación</li>
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
