import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// --- Componente para el Modal de Predicciones Mejorado ---
const PredictionModal = ({ station, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // >> INICIO DE LA CORRECCIÓN <<
  // Este useEffect se asegura de que el estado de la animación se reinicie
  // cada vez que se abre el modal con una nueva estación.
  useEffect(() => {
    if (station) {
      setIsExiting(false);
    }
  }, [station]);
  // >> FIN DE LA CORRECCIÓN <<
  
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClose]);

  useEffect(() => {
    if (station) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [station, handleClose]);

  if (!station) return null;

  // Datos simulados de predicción
  const predictionData = {
    today: { precipitation: 15.2, probability: 85, condition: 'Lluvia moderada' },
    tomorrow: { precipitation: 8.7, probability: 60, condition: 'Lluvia ligera' },
    dayAfter: { precipitation: 3.1, probability: 30, condition: 'Parcialmente nublado' }
  };

  return (
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
            <h3 className="modal-title">Predicción de Precipitación</h3>
            <div className="modal-decoration"></div>
          </div>

          <div className="prediction-cards">
            <div className="prediction-card today">
              <div className="prediction-icon">🌧️</div>
              <div className="prediction-info">
                <span className="prediction-day">Hoy</span>
                <span className="prediction-amount">{predictionData.today.precipitation} mm</span>
                <span className="prediction-probability">{predictionData.today.probability}% probabilidad</span>
                <span className="prediction-condition">{predictionData.today.condition}</span>
              </div>
            </div>

            <div className="prediction-card tomorrow">
              <div className="prediction-icon">🌦️</div>
              <div className="prediction-info">
                <span className="prediction-day">Mañana</span>
                <span className="prediction-amount">{predictionData.tomorrow.precipitation} mm</span>
                <span className="prediction-probability">{predictionData.tomorrow.probability}% probabilidad</span>
                <span className="prediction-condition">{predictionData.tomorrow.condition}</span>
              </div>
            </div>

            <div className="prediction-card day-after">
              <div className="prediction-icon">⛅</div>
              <div className="prediction-info">
                <span className="prediction-day">Pasado mañana</span>
                <span className="prediction-amount">{predictionData.dayAfter.precipitation} mm</span>
                <span className="prediction-probability">{predictionData.dayAfter.probability}% probabilidad</span>
                <span className="prediction-condition">{predictionData.dayAfter.condition}</span>
              </div>
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
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <div className="detail-info">
                  <span className="detail-label">Última actualización</span>
                  <span className="detail-value">Hace 15 minutos</span>
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
            onClick={() => onDownload(station, 'csv')}
          >
            <span className="btn-icon">📊</span>
            <span className="btn-text">CSV</span>
          </button>
          <button 
            className="action-button download-btn excel"
            onClick={() => onDownload(station, 'excel')}
          >
            <span className="btn-icon">📈</span>
            <span className="btn-text">Excel</span>
          </button>
        </div>
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
    { id: 'P43', type: 'Pluviométrica', name: 'Antisana Limboasi', position: [-0.59348, -78.20825] },
    { id: 'P42', type: 'Pluviométrica', name: 'Antisana Ramón Huañuna', position: [-0.60228, -78.19867] },
  ];

  const handleDownload = (station, format) => {
    console.log(`Descargando datos de ${station.name} en formato ${format}`);
    // Aquí iría la lógica de descarga
  };

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
