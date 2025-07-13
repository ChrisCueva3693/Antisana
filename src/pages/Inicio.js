import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación interna
import { FaLeaf, FaTint, FaMountain } from 'react-icons/fa';
import './Inicio.css';

// Componente para las tarjetas de características
const FeatureCard = ({ title, children }) => (
  <div className="feature-card">
    <h3 className="feature-title">{title}</h3>
    <p className="feature-text">{children}</p>
  </div>
);

// --- INICIO DE LA SECCIÓN MODIFICADA ---
// Componente para las tarjetas circulares de información
const InfoCircle = ({ image, title, text, icon, link, isExternal }) => {
  
  // Creamos un componente interno para el botón, que será un enlace <a> o un <Link>
  const ButtonLink = () => {
    if (isExternal) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="info-circle-button">
          Saber más
        </a>
      );
    }
    return (
      <Link to={link} className="info-circle-button">
        Saber más
      </Link>
    );
  };

  // El contenedor principal ya no es un enlace
  return (
    <div className="info-circle">
      <div className="info-circle-image-container">
        <img src={image} alt={title} className="info-circle-image" />
        <div className="info-circle-icon">{icon}</div>
      </div>
      <h4 className="info-circle-title">{title}</h4>
      <p className="info-circle-text">{text}</p>
      {/* El enlace ahora está solo en el botón */}
      <ButtonLink />
    </div>
  );
};
// --- FIN DE LA SECCIÓN MODIFICADA ---

export default function Inicio() {
  return (
    <div className="inicio-container">
      {/* --- Sección Principal (Hero) --- */}
      <section className="hero-section">
        <div className="hero-background-image" style={{ backgroundImage: "url('/inicio/antisana_portada.webp')" }}></div>
        <div className="hero-shape">
          <div className="hero-text-content">
            <h1 className="hero-title">
              ANTISANA
            </h1>
            <p className="hero-subtitle">Guardián del Agua y la Vida</p>
          </div>
        </div>
      </section>

      {/* --- Sección de Características --- */}
      <section className="features-section">
        <FeatureCard title="Nuestro Propósito">
          Desarrollar un sistema de análisis predictivo de la precipitación en la zona del Antisana para anticipar eventos extremos y gestionar de forma sostenible los recursos hídricos.
        </FeatureCard>
        <FeatureCard title="Tecnología e Innovación">
          Utilizamos modelos estadísticos y de inteligencia artificial para analizar datos meteorológicos, transformando la información en herramientas visuales y alertas tempranas.
        </FeatureCard>
        <FeatureCard title="Impacto Comunitario">
          Buscamos proporcionar información clara y accesible para la ciudadanía, fomentando una cultura de prevención y conservación del ecosistema del páramo.
        </FeatureCard>
      </section>

      {/* --- Sección de Video --- */}
      <section className="video-section">
        <h2 className="section-title">Conoce más sobre el Antisana</h2>
        <div className="video-container">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/psQTd-Blqp0?si=bzqlOOLETOV0fIVc" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
          </iframe>
        </div>
      </section>

      {/* --- Sección de Tarjetas Circulares con Enlaces --- */}
      <section className="info-circles-section">
        <InfoCircle 
          image="/inicio/ecosistema.webp"
          title="El Ecosistema del Páramo"
          text="Descubre la importancia del páramo como una esponja natural que regula el ciclo del agua."
          icon={<FaLeaf />}
          link="https://www.antisana.com/#antisana-map"
          isExternal={true}
        />
        <InfoCircle 
          image="/inicio/prediccion.jpg"
          title="Predicciones Climáticas"
          text="Explora nuestro mapa interactivo con las predicciones de lluvia y sequía para los próximos meses."
          icon={<FaTint />}
          link="/mapa" // Ruta a tu componente Mapa.js
          isExternal={false}
        />
        <InfoCircle 
          image="/inicio/prophet.png"
          title="Nuestro Modelo Predictivo"
          text="Aprende cómo funciona nuestro modelo y la tecnología que utilizamos para analizar el clima."
          icon={<FaMountain />}
          link="https://www.youtube.com/watch?v=mTrPpd-sMvY"
          isExternal={true}
        />
      </section>
    </div>
  );
}
