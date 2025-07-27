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
const PredictionModal = ({ predictionInfo, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const modalBodyRef = useRef(null);

    useEffect(() => {
        if (predictionInfo) {
            setIsExiting(false);
            if (modalBodyRef.current) {
                modalBodyRef.current.scrollTop = 0;
            }
        }
    }, [predictionInfo]);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 400);
    }, [onClose]);

    useEffect(() => {
        if (predictionInfo) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [predictionInfo]);

    if (!predictionInfo) return null;

    const { station, type } = predictionInfo;
    // Asegúrate de que 'predictions' y 'type' existen antes de acceder a ellos
    const graphImage = station.predictions && station.predictions[type] ? station.predictions[type].graphImage : '';
    const recommendations = station.predictions && station.predictions[type] ? station.predictions[type].recommendations : '';


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

                    <div className="modal-body" ref={modalBodyRef}>
                        <div className="modal-header">
                            <h3 className="modal-title">Análisis Predictivo de {type}</h3>
                            <div className="modal-decoration"></div>
                        </div>

                        <div className="prediction-placeholder">
                            <div className="prediction-chart-image-container" onClick={() => setIsImageZoomed(true)}>
                                <img
                                    src={graphImage}
                                    alt={`Gráfico de predicción para ${station.name}`}
                                    className="prediction-chart-image"
                                />
                                <div className="image-zoom-overlay">
                                    <span>🔍</span> Haz clic para ampliar
                                </div>
                            </div>

                            <div className="recommendations-container">
                                {recommendations}
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
            {isImageZoomed && <ImageLightbox src={graphImage} alt={`Gráfico de ${station.name}`} onClose={() => setIsImageZoomed(false)} />}
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
        <div ref={statRef} className="animated-stat" style={{ animationDelay: `${delay}ms` }}>
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

                {/* Bloque para Precipitación */}
                <div className="prediction-group">
                    <h4 className="prediction-group-title">Precipitación</h4>
                    <div className="station-actions">
                        <button
                            className="action-button prediction-btn"
                            onClick={() => onViewPrediction(station, 'Precipitación')}
                        >
                            <span className="btn-icon">🔮</span>
                            <span className="btn-text">Predicción</span>
                        </button>
                        <button
                            className="action-button download-btn csv"
                            onClick={() => onDownload(station, 'Precipitación')}
                        >
                            <span className="btn-icon">📊</span>
                            <span className="btn-text">CSV</span>
                        </button>
                    </div>
                </div>

                {/* Bloque para Nivel de Caudal */}
                <div className="prediction-group">
                    <h4 className="prediction-group-title">Nivel de Caudal</h4>
                    <div className="station-actions">
                        <button
                            className="action-button prediction-btn"
                            onClick={() => onViewPrediction(station, 'Caudal')}
                        >
                            <span className="btn-icon">🌊</span>
                            <span className="btn-text">Predicción</span>
                        </button>
                        <button
                            className="action-button download-btn csv"
                            onClick={() => onDownload(station, 'Caudal')}
                        >
                            <span className="btn-icon">📊</span>
                            <span className="btn-text">CSV</span>
                        </button>
                    </div>
                </div>

                {/* Nuevo Bloque para Temperatura */}
                <div className="prediction-group">
                    <h4 className="prediction-group-title">Temperatura</h4>
                    <div className="station-actions">
                        <button
                            className="action-button prediction-btn"
                            onClick={() => onViewPrediction(station, 'Temperatura')}
                        >
                            <span className="btn-icon">🌡️</span> {/* Icono de termómetro */}
                            <span className="btn-text">Predicción</span>
                        </button>
                        <button
                            className="action-button download-btn csv"
                            onClick={() => onDownload(station, 'Temperatura')}
                        >
                            <span className="btn-icon">📊</span>
                            <span className="btn-text">CSV</span>
                        </button>
                    </div>
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
    const [predictionInfo, setPredictionInfo] = useState(null);

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
            predictions: {
                'Precipitación': {
                    graphImage: '/Solo_Prediccion_Resaltada_P43.png',
                    csvFile: '/Prediccion_Prophet_Diaria_Etiquetada_43.csv',
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Lluvias – Estación Limboasi 📊</h4>
                            <p>La estación Limboasi presenta un pronóstico de alta precipitación, con un promedio de 3.5 mm, lo que la define como una zona considerablemente húmeda. Su patrón climático está dominado por una temporada de lluvias extremadamente intensa a mediados de año. A continuación, el análisis detallado del pronóstico.</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Climáticos 🗓️</h5><p>El ciclo anual en Limboasi está marcado por contrastes muy fuertes entre la temporada seca y la lluviosa:</p><ul className="recommendations-list"><li><strong>Inicio de Año: Temporada Seca (Enero - Mediados de Marzo) ☀️:</strong> El año arranca con el período más seco. Las lluvias se mantendrán en niveles relativamente bajos, principalmente entre 1.5 y 2.5 mm. La presencia de "Días Secos" (puntos amarillos) 🟡 es notable.</li><li><strong>Incremento Sostenido (Finales de Marzo - Abril) 📈:</strong> Esta es una fase de transición clara y ascendente. Las precipitaciones aumentarán de forma constante, preparando el terreno para la temporada principal de lluvias.</li><li><strong>Temporada de Lluvias Torrenciales (Mayo - Julio) ⛈️:</strong> Este trimestre es el evento climático central del año. Se esperan lluvias muy intensas y persistentes, superando consistentemente los 4.0 mm y alcanzando picos por encima de los 6.0 mm.</li><li><strong>Caída Abrupta (Agosto) 📉:</strong> El final de la temporada de lluvias es repentino. Agosto registrará un descenso muy rápido en las precipitaciones.</li><li><strong>Período Húmedo e Irregular (Septiembre - Noviembre) 🌦️:</strong> Limboasi no entra en una sequía pronunciada, sino que experimenta un período de lluvias intermitentes y moderadas.</li><li><strong>Cierre de Año Variable (Diciembre) ✨:</strong> El año finaliza manteniendo este patrón irregular, con una mezcla de días secos y lluviosos.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas 💡</h5><ul className="recommendations-list"><li><strong>Gestión de Riesgos y Excedentes de Agua ⚠️:</strong> La principal preocupación es la gestión del exceso de agua entre mayo y julio. La infraestructura debe estar preparada para soportar caudales y niveles de saturación del suelo muy altos.</li><li><strong>Planificación Agrícola y Civil 🚜:</strong> La temporada de lluvias torrenciales puede ser destructiva para ciertos cultivos. La ventana ideal para estas actividades es el inicio seco del año (enero-marzo).</li><li><strong>Recursos Hídricos 💧:</strong> Gracias a su intensa temporada de lluvias, esta zona probablemente no sufrirá de escasez de agua. El reto es su manejo y control durante los picos extremos.</li></ul></div>
                        </>
                    )
                },
                'Caudal': {
                    graphImage: '/H44-Antisana_Limboasi-PREDICCION_365DIAS.png',
                    csvFile: '/H44-Antisana_Limboasi-PREDICCION_365DIAS.csv',
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Caudal 📊</h4>
                            <p>Esta predicción de caudal para los próximos 365 días muestra un ciclo hidrológico muy bien definido, con un caudal promedio de 2.08 m³/s. El comportamiento del río está marcado por dos temporadas de aguas bajas (estiaje) y una temporada de aguas altas muy pronunciada a mediados de año.</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Clave del Caudal 🗓️</h5><p>El comportamiento del río se puede segmentar en las siguientes fases:</p><ul className="recommendations-list"><li><strong>Inicio de Año: Temporada de Estiaje (Enero - Marzo) 🏜️:</strong> El año comienza con un período de aguas bajas muy marcado. El caudal desciende progresivamente, alcanzando su punto más bajo del año en marzo.</li><li><strong>Transición y Crecida (Abril - Mayo) 📈:</strong> A partir de abril, el río inicia una franca recuperación. El caudal aumenta de manera constante y rápida, saliendo del estiaje.</li><li><strong>Temporada de Aguas Altas (Junio - Agosto) 🌊:</strong> Este trimestre es el evento hidrológico más importante del año. El caudal se mantiene en niveles elevados y presenta dos picos muy definidos y pronunciados.</li><li><strong>Descenso del Caudal (Septiembre) 📉:</strong> Tras el segundo pico de julio, el caudal comienza un descenso rápido y sostenido durante todo septiembre.</li><li><strong>Segundo Período de Estiaje (Octubre - Diciembre) ☀️:</strong> El último trimestre del año se caracteriza por un segundo período de aguas bajas, aunque ligeramente más variable que el de inicio de año.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas para la Gestión del Caudal 💡</h5><p>Basado en este pronóstico, se pueden emitir las siguientes recomendaciones clave:</p><ul className="recommendations-list"><li><strong>Gestión de Recursos Hídricos y Agua Potable 💧:</strong> Maximizar la captación y el almacenamiento de agua en embalses durante el pico de junio y julio. Las reservas acumuladas serán cruciales para garantizar el suministro durante los 6 meses de aguas bajas.</li><li><strong>Planificación Agrícola y Riego 🚜:</strong> Planificar los cultivos de mayor demanda hídrica para que su fase de máximo requerimiento coincida con la temporada de aguas altas (junio - agosto).</li><li><strong>Gestión de Presas y Generación Hidroeléctrica ⚡:</strong> Preparar las turbinas para operar a máxima capacidad durante junio y julio para aprovechar los dos picos de caudal.</li><li><strong>Prevención de Riesgos y Obras Civiles ⚠️:</strong> Realizar inspecciones y mantenimiento de riberas y puentes antes de mayo. Evitar trabajos en las llanuras de inundación del río durante junio y julio.</li></ul></div>
                        </>
                    )
                },
                'Temperatura': { // Nuevo tipo de predicción para Temperatura
                    graphImage: '/H44-Antisana_Limboasi_Temperatura-PREDICCION_365DIAS.png', // Reemplaza con la ruta real de tu imagen de predicción de temperatura
                    csvFile: '/H44-Antisana_Limboasi_Temperatura-PREDICCION_365DIAS.csv',     // Reemplaza con la ruta real de tu archivo CSV de temperatura
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Temperatura 🌡️</h4>
                            <p>Este pronóstico presenta la variación de la temperatura para la zona de Antisana (Limboasi) durante los próximos 365 días, con una temperatura promedio de 5.29 °C. El ciclo anual muestra una notable variabilidad, destacando un período prolongado de temperaturas elevadas a inicios de año, seguido de un descenso marcado hacia un período frío en el tercer trimestre, lo que sugiere la necesidad de una planificación adaptativa para actividades sensibles al clima.</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Clave de Temperatura 🗓️</h5><p>El comportamiento de la temperatura para los próximos 365 días se puede dividir en las siguientes fases críticas:</p><ul className="recommendations-list"><li><strong>Período Cálido Extendido (Enero - Mayo) ☀️:</strong> El año comienza con temperaturas por encima del promedio, manteniéndose consistentemente altas. Se observa un pico máximo muy pronunciado a mediados de mayo, donde las temperaturas alcanzan sus puntos más elevados del año, superando los 5.5 °C.</li><li><strong>Descenso y Transición (Junio) 📉:</strong> Inmediatamente después del pico de mayo, las temperaturas inician un descenso rápido y sostenido, marcando la transición hacia la temporada más fría del año.</li><li><strong>Temporada Fría (Julio - Octubre) 🥶:</strong> Este cuatrimestre se perfila como el período más frío. Las temperaturas caerán a sus niveles más bajos entre agosto y septiembre, situándose por debajo de los 5.1 °C. Es la fase más larga de temperaturas por debajo del promedio.</li><li><strong>Recuperación y Segundo Pico (Noviembre - Diciembre) 📈:</strong> A partir de octubre, las temperaturas inician una clara recuperación. Esta fase se caracteriza por un segundo pico de temperaturas altas, aunque más corto y menos intenso que el de mayo, que se extiende hasta finales de año.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas Basadas en la Temperatura 💡</h5><p>Este patrón de temperatura requiere una planificación cuidadosa para diversas actividades en la región del Antisana:</p><ul className="recommendations-list"><li><strong>Turismo y Actividades Recreativas 🏞️:</strong> La mejor ventana para visitas y montañismo, buscando condiciones más templadas, es entre enero y mayo. Se debe advertir a los visitantes sobre las condiciones significativamente más frías y la mayor probabilidad de heladas entre julio y octubre.</li><li><strong>Agricultura y Ganadería de Páramo 🧑‍🌾:</strong> Planificar los ciclos de siembra o pastoreo para aprovechar el período cálido de enero a mayo. Se deben tomar precauciones para proteger los cultivos y al ganado del frío intenso y las posibles heladas durante el período de julio a octubre.</li><li><strong>Conservación y Monitoreo de Ecosistemas 🐠:</strong> El aumento de la temperatura en el primer semestre podría acelerar el deshielo de glaciares. Es crucial monitorear el impacto del período frío (julio-octubre) en la flora y fauna del páramo, que pueden ser vulnerables a descensos bruscos de temperatura.</li><li><strong>Gestión de Riesgos ⚠️:</strong> El período frío y de bajas temperaturas de julio a octubre puede aumentar los riesgos para la salud de las comunidades locales y de los trabajadores en la zona. Es importante prepararse con ropa adecuada y refugios para enfrentar las condiciones más adversas.</li></ul></div>
                        </>
                    )
                }
            }
        },
        {
            id: 'P42',
            type: 'Pluviométrica',
            name: 'Antisana Ramón Huañuna',
            position: [-0.60228, -78.19867],
            predictions: {
                'Precipitación': {
                    graphImage: '/Solo_Prediccion_Resaltada_P42.png',
                    csvFile: '/Prediccion_Prophet_Diaria_Etiquetada_42.csv',
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Lluvias – Estación Ramón Huañuna 📊</h4>
                            <p>La predicción de precipitaciones para la estación Ramón Huañuna muestra un patrón climático muy particular y definido para los próximos 365 días. Con una lluvia promedio de 1.9 mm, esta zona es notablemente más seca en comparación con otras, lo que exige una planificación aún más cuidadosa. A continuación, se desglosa el pronóstico mes a mes. 💧</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Climáticos 🗓️</h5><p>El año se puede dividir en fases muy claras, cada una con características e implicaciones distintas:</p><ul className="recommendations-list"><li><strong>Inicio de Año Seco (Enero - Mediados de Marzo) ☀️:</strong> El año comienza con una temporada marcadamente seca. Las precipitaciones se mantendrán en niveles bajos, oscilando entre 1.0 y 1.5 mm.</li><li><strong>Transición y Primer Pulso de Lluvias (Finales de Marzo - Mayo) 🌦️:</strong> A partir de finales de marzo, el patrón cambia. Se observa un incremento gradual pero significativo de las lluvias, marcando el final de la primera temporada seca.</li><li><strong>Temporada de Lluvias Intensas (Junio - Julio) ⛈️:</strong> Estos dos meses representan el corazón de la temporada lluviosa. Se esperan los picos más altos de precipitación del año, superando consistentemente los 3.0 mm.</li><li><strong>Descenso Brusco (Agosto) 📉:</strong> Inmediatamente después del pico de julio, agosto actuará como un mes de transición con un descenso rápido y pronunciado en los niveles de lluvia.</li><li><strong>Período de Sequía Pronunciada (Septiembre - Noviembre) 🏜️:</strong> Este trimestre se perfila como el más seco y crítico del año. Las precipitaciones caerán a sus niveles más bajos.</li><li><strong>Cierre de Año (Diciembre) ✨:</strong> El año concluye con una ligera recuperación en las lluvias, rompiendo la tendencia de sequía de los meses anteriores.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas 💡</h5><ul className="recommendations-list"><li><strong>Gestión del Agua 댐:</strong> Es vital maximizar la captación y almacenamiento de agua durante el pico de lluvias de junio y julio. Estos dos meses son la única ventana significativa para acumular reservas.</li><li><strong>Planificación Agrícola 🌽:</strong> Los ciclos de siembra deben estar sincronizados con la temporada de lluvias de mediados de año. Para el resto del año, será indispensable contar con sistemas de riego eficientes.</li><li><strong>Prevención de Riesgos ⚠️:</strong> Aunque la zona es seca, la concentración de lluvias en junio y julio puede aumentar el riesgo de erosión. La sequía de septiembre-noviembre eleva el riesgo de sequía agrícola y podría crear condiciones favorables para incendios forestales.</li></ul></div>
                        </>
                    )
                },
                'Caudal': {
                    graphImage: '/H15-Ramon_Huañuna_Caudal-PREDICCION_365DIAS.png',
                    csvFile: '/H15-Ramon_Huañuna_Caudal-PREDICCION_365DIAS.csv',
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Caudal 📊</h4>
                            <p>Este pronóstico muestra el comportamiento de un río con un caudal promedio bajo, de solo 1.31 m³/s. El ciclo anual es muy dinámico y se caracteriza por un pico de caudal muy temprano en el año, seguido de un período de estiaje (aguas bajas) muy severo, lo que requiere una gestión sumamente cuidadosa.</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Clave del Caudal 🗓️</h5><p>El comportamiento del río para los próximos 365 días se puede dividir en las siguientes fases críticas:</p><ul className="recommendations-list"><li><strong>Pico Temprano y Caída Brusca (Enero - Febrero) 🎢:</strong> A diferencia de otros patrones, el año comienza con un pico de caudal alto, breve pero intenso, que alcanza su máximo en febrero. Inmediatamente después, el caudal se desploma.</li><li><strong>Temporada de Estiaje Crítico (Marzo - Abril) 🏜️:</strong> Este bimestre se perfila como el período más desafiante y de mayor riesgo del año. El caudal caerá a sus niveles más bajos, llegando a apenas 1.05 m³/s.</li><li><strong>Recuperación y Aguas Altas (Mayo - Agosto) 🌊:</strong> A partir de mayo, el río inicia su recuperación. La temporada principal de aguas altas se extiende de junio a agosto, con múltiples picos que alcanzan nuevamente la marca de 1.5 m³/s.</li><li><strong>Segundo Período de Estiaje (Septiembre - Noviembre) ☀️:</strong> Tras el máximo de verano, el río entra en una segunda temporada de aguas bajas, aunque menos severa que la de marzo-abril.</li><li><strong>Cierre de Año en Aguas Bajas (Diciembre - Enero 2026) 📉:</strong> El año termina con el río en este segundo período de estiaje, con una tendencia a mantener o disminuir sus niveles.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas para la Gestión del Caudal 💡</h5><p>El patrón único de este río exige una estrategia de gestión muy específica:</p><ul className="recommendations-list"><li><strong>Gestión de Recursos Hídricos y Agua Potable 💧:</strong> La prioridad es gestionar las reservas para sobrevivir al estiaje crítico de marzo y abril. La temporada de mayo a agosto debe usarse para rellenar los embalses al máximo.</li><li><strong>Planificación Agrícola y Riego 🚜:</strong> Evitar cualquier siembra de alta demanda hídrica antes de mayo. Los ciclos de cultivo deben comenzar con la recuperación del caudal en mayo.</li><li><strong>Protección de Ecosistemas Acuáticos 🐠:</strong> Implementar un plan de caudal ecológico durante marzo y abril para asegurar que un mínimo vital de agua se mantenga fluyendo en el río.</li><li><strong>Gestión de Presas y Generación Hidroeléctrica ⚡:</strong> Operar en modo de conservación extrema desde finales de febrero hasta abril. La generación de energía se concentrará en el período de junio a agosto.</li></ul></div>
                        </>
                    )
                },
                'Temperatura': { // Nuevo tipo de predicción para Temperatura
                    graphImage: '/H15-Ramon_Huañuna_Temperatura-PREDICCION_365DIAS.png', // Reemplaza con la ruta real de tu imagen de predicción de temperatura
                    csvFile: '/H15-Ramon_Huañuna_Temperatura-PREDICCION_365DIAS.csv',     // Reemplaza con la ruta real de tu archivo CSV de temperatura
                    recommendations: (
                        <>
                            <h4 className="recommendations-title">Análisis Detallado de la Predicción de Temperatura 🌡️</h4>
                            <p>Este pronóstico detalla la evolución de la temperatura para la estación Ramón Huañuna durante los próximos 365 días, presentando una temperatura promedio de 6.21 °C. El patrón anual es muy claro y se divide en dos grandes mitades: una primera parte del año marcadamente cálida y una segunda mitad significativamente más fría. Esta dualidad climática requiere una planificación cuidadosa y adaptada a cada temporada.</p>
                            <div className="recommendations-section"><h5>Desglose por Períodos Clave de Temperatura 🗓️</h5><p>El comportamiento de la temperatura para los próximos 365 días se puede dividir en las siguientes fases críticas:</p><ul className="recommendations-list"><li><strong>Temporada Cálida Principal (Febrero - Junio) ☀️:</strong> El año se caracteriza por un largo período de temperaturas elevadas que se consolida en febrero y se extiende hasta principios de junio. Durante esta fase, las temperaturas se mantienen consistentemente por encima del promedio, alcanzando su punto máximo alrededor de mayo, con valores que superan los 6.75 °C.</li><li><strong>Descenso Brusco (Junio - Julio) 📉:</strong> Tras el pico de calor, se produce una caída muy pronunciada y rápida de la temperatura, marcando la transición más abrupta del año hacia la temporada fría.</li><li><strong>Temporada Fría Pronunciada (Julio - Octubre) 🥶:</strong> Este período constituye la fase más fría del año. Las temperaturas caen a sus niveles más bajos, llegando a un mínimo de aproximadamente 5.25 °C en septiembre. Es un período sostenido de frío que define el clima de la mitad del año.</li><li><strong>Recuperación y Segundo Pico Cálido (Octubre - Enero 2026) 📈:</strong> A partir de octubre, las temperaturas inician una recuperación constante y rápida. Esta recuperación conduce a una segunda temporada de temperaturas altas entre noviembre y enero, que es intensa y marcada por varios picos, consolidando un cierre de año cálido.</li></ul></div>
                            <div className="recommendations-section"><h5>Recomendaciones Estratégicas Basadas en la Temperatura 💡</h5><p>El marcado patrón estacional de esta zona exige una gestión proactiva:</p><ul className="recommendations-list"><li><strong>Planificación Agrícola y de Pastoreo 🧑‍🌾:</strong> Concentrar los ciclos de cultivo o las actividades de pastoreo que requieren temperaturas más cálidas en la primera mitad del año (febrero-mayo). Es vital tomar medidas preventivas, como el uso de invernaderos o la protección del ganado, para mitigar el impacto del frío severo entre julio y octubre.</li><li><strong>Turismo y Actividades al Aire Libre 🏞️:</strong> Las mejores épocas para visitas turísticas, senderismo o acampada son los períodos cálidos de febrero a mayo y de noviembre a enero. Se debe informar a los turistas sobre la drástica caída de temperatura a partir de junio y el frío intenso del tercer trimestre, recomendando equipo adecuado.</li><li><strong>Gestión de Recursos Naturales y Ecosistemas 🐠:</strong> Monitorear cómo la prolongada temporada de frío (julio-octubre) afecta a las especies de flora y fauna locales, especialmente aquellas sensibles a las heladas. El período cálido puede influir en la disponibilidad de agua por derretimiento de glaciares, si aplica en la zona.</li><li><strong>Infraestructura y Comunidades Locales 🏠:</strong> Las comunidades deben prepararse para un mayor consumo de energía para calefacción durante la temporada fría. Es un buen momento para realizar mantenimiento de infraestructuras (caminos, refugios) durante la primera mitad del año, cuando las condiciones climáticas son más favorables.</li></ul></div>
                        </>
                    )
                }
            }
        },
    ];

    const handleDownload = (station, type) => {
        const csvFile = station.predictions[type].csvFile;
        const link = document.createElement('a');
        link.href = csvFile;
        link.setAttribute('download', `${station.id}_${type.toLowerCase().replace(/\s/g, '_')}_prediccion.csv`); // Asegura nombre de archivo válido
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewPrediction = (station, type) => {
        setPredictionInfo({ station, type });
    };

    return (
        <div className="map-page-container">
            {/* Estructura del Hero Section simplificada */}
            <div className="mapa-hero-section">
                <h1 className="mapa-hero-title">Red de Monitoreo Climático</h1>
                <p className="mapa-hero-subtitle">Explora nuestras estaciones de monitoreo en el Antisana y accede a predicciones meteorológicas precisas.</p>
            </div>

            <div className="stats-section">
                <AnimatedStat number={2} label="Estaciones activas" suffix="" delay={0} />
                <AnimatedStat number={24} label="Horas de monitoreo" suffix="/7" delay={200} />
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
                            >
                                <Popup>
                                    <div className="popup-content">
                                        <strong>{station.name}</strong>
                                        <p>Tipo: {station.type}</p>
                                        <p>Código: {station.id}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    <Legend />
                </div>
            </div>

            <PredictionModal
                predictionInfo={predictionInfo}
                onClose={() => setPredictionInfo(null)}
            />
        </div>
    );
}