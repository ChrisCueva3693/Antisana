import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// --- Componente para el Lightbox de la Imagen ---
const ImageLightbox = ({ src, alt, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <img src={src} alt={alt} className="lightbox-image" />
        </div>
    );
};


// --- Componente para el Modal de Predicciones Mejorado ---
const PredictionModal = ({ station, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (station) {
      setIsExiting(false);
    }
  }, [station]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClose]);

  useEffect(() => {
    if (station) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [station]);

  if (!station) return null;

  return (
    <>
      <div
        className={`modal-overlay ${isExiting ? 'modal-overlay-exit' : ''}`}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`modal-content ${isExiting ? 'modal-content-exit' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-image-container">
            <div className="modal-station-header">
              <div className="station-type-badge">{station.type}</div>
              <h2 id="modal-title" className="station-name">{station.name}</h2>
              <p className="station-code">Código: {station.id}</p>
            </div>
            <div className="modal-image-overlay"></div>
            <button
              onClick={handleClose}
              className="modal-close-button"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="modal-header">
              <h3 className="modal-title">Análisis Predictivo</h3>
              <div className="modal-decoration"></div>
            </div>

            <div className="prediction-placeholder">
              <div className="prediction-chart-image-container" onClick={() => setIsImageZoomed(true)}>
                 <img 
                    src={station.graphImage} 
                    alt={`Gráfico de predicción para ${station.name}`} 
                    className="prediction-chart-image"
                 />
                 <div className="image-zoom-overlay">
                    <span>🔍</span> Haz clic para ampliar
                 </div>
              </div>
              
              <div className="recommendations-container">
                  <p>
                      Este gráfico muestra la predicción de precipitación, resaltando posibles sequías y lluvias intensas.
                  </p>
                  
                  <h4 className="recommendations-title">Análisis de Predicción de Precipitaciones 2025</h4>
                  <p>Recomendaciones para la ciudadanía:</p>
                  
                  <div className="recommendations-section">
                      <h5>Durante sequías:</h5>
                      <ul className="recommendations-list">
                          <li>Hacer uso responsable del agua en el hogar y lugares de trabajo.</li>
                          <li>Evitar el riego excesivo de jardines o el lavado de vehículos.</li>
                          <li>Mantenerse informado sobre posibles restricciones o cortes programados de agua.</li>
                          <li>Apoyar medidas de conservación hídrica impulsadas por autoridades locales.</li>
                      </ul>
                  </div>

                  <div className="recommendations-section">
                      <h5>Durante lluvias intensas:</h5>
                      <ul className="recommendations-list">
                          <li>Revisar y limpiar canales, alcantarillas y techos para evitar acumulaciones de agua.</li>
                          <li>Evitar transitar por zonas propensas a deslizamientos o inundaciones.</li>
                          <li>Tener a mano un kit de emergencia en caso de evacuación.</li>
                          <li>Seguir las recomendaciones emitidas por el sistema de gestión de riesgos y emergencias.</li>
                      </ul>
                  </div>

                  <p>
                      El monitoreo constante de estos eventos permitirá una mejor preparación y respuesta ante fenómenos climáticos extremos, minimizando riesgos para la población y la infraestructura.
                  </p>
              </div>

            </div>
            
            <div className="station-details">
              <h4 className="details-title">📊 Detalles de la Estación</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div className="detail-info">
                    <span className="detail-label">Ubicación</span>
                    <span className="detail-value">Lat: {station.position[0].toFixed(4)}, Lng: {station.position[1].toFixed(4)}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎯</span>
                  <div className="detail-info">
                    <span className="detail-label">Tipo</span>
                    <span className="detail-value">{station.type}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📡</span>
                  <div className="detail-info">
                    <span className="detail-label">Estado</span>
                    <span className="detail-value status-active">Activa</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleClose}
                className="modal-action-button"
                autoFocus
              >
                <span className="button-text">Entendido</span>
                <span className="button-icon">✓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isImageZoomed && <ImageLightbox src={station.graphImage} alt={`Gráfico de ${station.name}`} onClose={() => setIsImageZoomed(false)} />}
    </>
  );
};


// --- Componente para Estadísticas Animadas ---
const AnimatedStat = ({ number, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const statRef = useRef(null);

  useEffect(() => {
    const element = statRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = number / totalSteps;
          let currentCount = 0;

          const counter = setInterval(() => {
            currentCount += increment;
            if (currentCount >= number) {
              clearInterval(counter);
              setCount(number);
            } else {
              setCount(currentCount);
            }
          }, stepTime);
          
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [number]);

  return (
    <div ref={statRef} className="animated-stat" style={{animationDelay: `${delay}ms`}}>
      <span className="stat-number">{Math.floor(count)}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

// --- Componente para Tarjeta de Estación Interactiva ---
const StationCard = ({ station, onDownload, onViewPrediction, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="station-card"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-background"></div>
      <div className="card-content">
        <div className="station-header">
          <div className="station-icon-container">
            <span className="station-icon">📡</span>
            <div className={`station-glow ${isHovered ? 'station-glow-active' : ''}`}></div>
          </div>
          <div className="station-info">
            <h3 className="station-name">{station.name}</h3>
            <p className="station-type">{station.type}</p>
            <p className="station-code">Código: {station.id}</p>
          </div>
        </div>

        {/* --- INICIO DE LA SECCIÓN MODIFICADA --- */}
        <div className="station-actions">
          <button 
            className="action-button prediction-btn"
            onClick={() => onViewPrediction(station)}
          >
            <span className="btn-icon">🔮</span>
            <span className="btn-text">Predicción</span>
          </button>
          <button 
            className="action-button download-btn csv"
            onClick={() => onDownload(station)}
          >
            <span className="btn-icon">📊</span>
            <span className="btn-text">CSV</span>
          </button>
          {/* El botón de Excel ha sido eliminado */}
        </div>
        {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}
      </div>

      <div className="card-particles">
        <span className="particle particle-1">💧</span>
        <span className="particle particle-2">🌧️</span>
        <span className="particle particle-3">⛅</span>
      </div>
    </div>
  );
};

// --- Componente para la Leyenda Mejorada ---
const Legend = () => (
  <div className="map-legend">
    <h3 className="legend-title">🗺️ Leyenda</h3>
    <div className="legend-items">
      <div className="legend-item">
        <span className="legend-icon pluviometrica"></span>
        <span className="legend-text">Estación Pluviométrica</span>
      </div>
      <div className="legend-status">
        <div className="status-item">
          <span className="status-indicator active"></span>
          <span className="status-text">Activa</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Componente Principal del Mapa ---
export default function Mapa() {
  const [selectedStation, setSelectedStation] = useState(null);

  const createIcon = (color) => new L.DivIcon({
    html: `<div class="custom-marker-icon" style="background-color: ${color};">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>`,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  const pluviometricaIcon = createIcon('#3a5a40');

  const stations = [
    { 
      id: 'P43', 
      type: 'Pluviométrica', 
      name: 'Antisana Limboasi', 
      position: [-0.59348, -78.20825],
      graphImage: '/Solo_Prediccion_Resaltada_P43.png',
      csvFile: '/Prediccion_Prophet_Diaria_Etiquetada_43.csv' // Ruta al archivo CSV
    },
    { 
      id: 'P42', 
      type: 'Pluviométrica', 
      name: 'Antisana Ramón Huañuna', 
      position: [-0.60228, -78.19867],
      graphImage: '/Solo_Prediccion_Resaltada_P42.png',
      csvFile: '/Prediccion_Prophet_Diaria_Etiquetada_42.csv' // Ruta al archivo CSV
    },
  ];
  
  // --- INICIO DE LA NUEVA FUNCIÓN DE DESCARGA ---
  const handleDownload = (station) => {
    // Creamos un enlace temporal en el documento
    const link = document.createElement('a');
    link.href = station.csvFile; // Usamos la ruta del archivo CSV de la estación
    
    // Asignamos el nombre con el que se descargará el archivo
    link.setAttribute('download', `${station.id}_prediccion.csv`);
    
    // Añadimos el enlace al DOM, hacemos clic en él y lo removemos
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- FIN DE LA NUEVA FUNCIÓN DE DESCARGA ---

  const handleViewPrediction = (station) => {
    setSelectedStation(station);
  };

  return (
    <div className="map-page-container">
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">Red de Monitoreo Climático</h1>
          <p className="hero-subtitle">Explora nuestras estaciones de monitoreo en el Antisana y accede a predicciones meteorológicas precisas.</p>
        </div>
      </div>

      <div className="stats-section">
        <AnimatedStat number={2} label="Estaciones activas" suffix="" delay={0} />
        <AnimatedStat number={24} label="Horas de monitoreo" suffix="/7" delay={200} />
        <AnimatedStat number={95} label="Precisión en predicciones" suffix="%" delay={400} />
      </div>

      <div className="map-content-layout">
        <div className="stations-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Estaciones de Monitoreo</h2>
            <div className="sidebar-decoration"></div>
          </div>
          
          <div className="stations-grid">
            {stations.map((station, index) => (
              <StationCard
                key={station.id}
                station={station}
                onDownload={handleDownload}
                onViewPrediction={handleViewPrediction}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        <div className="map-area">
          <MapContainer 
            center={[-0.598, -78.203]} 
            zoom={13} 
            scrollWheelZoom={true} 
            className="leaflet-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map(station => (
              <Marker
                key={station.id}
                position={station.position}
                icon={pluviometricaIcon}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <strong>{station.name}</strong>
                    <p>Tipo: {station.type}</p>
                    <p>Código: {station.id}</p>
                    <button 
                      className="popup-button"
                      onClick={() => setSelectedStation(station)}
                    >
                      Ver Predicción
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <Legend />
        </div>
      </div>

      <PredictionModal 
        station={selectedStation} 
        onClose={() => setSelectedStation(null)} 
      />
    </div>
  );
}
