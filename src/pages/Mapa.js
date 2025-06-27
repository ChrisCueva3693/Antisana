import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Importa los CSS necesarios para que Leaflet y la página funcionen
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// --- COMPONENTES AUXILIARES ---

// Componente para la leyenda del mapa
const Legend = () => (
  <div className="map-legend">
    <h3 className="legend-title">Leyenda</h3>
    <ul>
      <li className="legend-item">
        <span className="legend-icon" style={{ backgroundColor: '#3a5a40' }}></span>
        <span className="legend-text">Pluviométrica</span>
      </li>
    </ul>
  </div>
);

// Componente para el Modal (ventana emergente) de predicciones
const PredictionModal = ({ station, onClose }) => {
    if (!station) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <span className="modal-station-type">{station.type}</span>
                        <h2 className="modal-title">{station.name}</h2>
                        <p className="modal-station-code">Código: {station.id}</p>
                    </div>
                    <button onClick={onClose} className="modal-close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <h3 className="modal-body-title">Predicción de Precipitación</h3>
                    <div className="modal-placeholder">
                        <p>Aquí se mostrará el gráfico de predicciones.</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-action-button">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DEL MAPA ---

export default function Mapa() {
  const [selectedStation, setSelectedStation] = useState(null);

  // Función para crear los íconos personalizados
  const createIcon = (color) => new L.DivIcon({
      html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="#FFF" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
  });

  const pluviometricaIcon = createIcon('#3a5a40');

  // Datos de las estaciones
  const stations = [
    { id: 'P43', type: 'Pluviométrica', name: 'Antisana Limboasi', position: [-0.59348, -78.20825] },
    { id: 'P42', type: 'Pluviométrica', name: 'Antisana Ramón Huañuna', position: [-0.60228, -78.19867] },
  ];

  return (
    <div className="map-page-layout">
      {/* Columna Izquierda: Sidebar con tabla de estaciones */}
      <div className="map-sidebar">
        <div className="sidebar-content">
          <h2 className="sidebar-title">Estaciones</h2>
          <div className="station-table">
            <div className="table-header">
              <span>Estación</span>
              <span>Acción</span>
            </div>
            {stations.map(station => (
              <div key={station.id} className="table-row">
                <span>{station.name}</span>
                <div className="table-actions">
                  <button className="btn btn-csv">CSV</button>
                  <button className="btn btn-excel">EXCEL</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: El mapa */}
      <div className="map-area">
        <MapContainer center={[-0.598, -78.203]} zoom={13} scrollWheelZoom={true} className="leaflet-container">
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
                click: () => {
                  setSelectedStation(station);
                },
              }}
            >
              <Popup>
                <b>{station.name}</b>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <Legend />
      </div>

      {/* El modal de predicción sigue funcionando para toda la página */}
      <PredictionModal station={selectedStation} onClose={() => setSelectedStation(null)} />
    </div>
  );
}
