import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Informacion.css';

// --- Componente para el Modal (Ventana Emergente) ---
const InfoModal = ({ data, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
        onClose();
    }, 400); // Esperamos que la animación de salida termine
  }, [onClose]);

  useEffect(() => {
    if (data) {
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
  }, [data, handleClose]);

  if (!data) return null;

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
          <img
            src={data.imageUrl}
            alt={data.title}
            className="modal-image"
            loading="lazy"
          />
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
            <h2 id="modal-title" className="modal-title">{data.title}</h2>
            <div className="modal-decoration"></div>
          </div>
          <div className="modal-text">
            {data.content}
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

// --- Componente para las Tarjetas Interactivas ---
const InteractiveCard = ({ icon, title, description, onClick, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="info-card"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Aprender sobre ${title}`}
    >
      <div className="card-background"></div>
      <div className="card-content">
        <div className="card-icon-container">
          <span className="card-icon">{icon}</span>
          <div className={`card-glow ${isHovered ? 'card-glow-active' : ''}`}></div>
        </div>
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="card-cta">
            <span className="cta-text">Descubrir más</span>
            <span className="cta-arrow">→</span>
          </div>
        </div>
      </div>
      <div className="card-particles">
        <span className="particle particle-1">✨</span>
        <span className="particle particle-2">💧</span>
        <span className="particle particle-3">🌿</span>
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


// --- Componente Principal de la Página de Información ---
export default function Informacion() {
  const [activeModal, setActiveModal] = useState(null);

  const aboutContent = {
    agua: {
      title: '¿De dónde viene el agua?',
      description: 'Descubre el secreto del páramo andino',
      imageUrl: '/inicio/viene_agua.png',
      content: (
        <div>
          <p>Imagina una esponja gigante en lo alto de una montaña. Esa esponja es el <strong>Páramo del Antisana</strong>.</p>
          <p>Cuando llueve o las nubes chocan con la montaña, el páramo atrapa toda esa agua, la limpia y la guarda. Luego, la libera poquito a poquito para formar los ríos que llevan el agua hasta tu casa.</p>
          <div className="modal-highlight">
            <strong>¿Sabías que?</strong> El páramo puede almacenar hasta 3 veces más agua que un bosque normal.
          </div>
        </div>
      )
    },
    ciclo: {
      title: 'El increíble viaje del agua',
      description: 'Sigue el camino del agua por el mundo',
      imageUrl: '/inicio/viaje_agua.png',
      content: (
        <div>
          <p>El agua es una gran viajera. El sol la calienta y la hace subir al cielo como vapor. Allá arriba, se junta en las nubes y, cuando están muy llenas, el agua cae como lluvia.</p>
          <p>A este viaje sin fin se le llama <strong>ciclo del agua</strong>, y es lo que hace posible la vida en nuestro planeta.</p>
          <div className="modal-steps">
            <div className="step"><span className="step-number">1</span><span className="step-text">Evaporación</span></div>
            <div className="step"><span className="step-number">2</span><span className="step-text">Condensación</span></div>
            <div className="step"><span className="step-number">3</span><span className="step-text">Precipitación</span></div>
          </div>
        </div>
      )
    },
    mision: {
      title: 'Nuestra Misión Especial',
      description: 'Tecnología para proteger la naturaleza',
      imageUrl: '/inicio/predicon_agua.png',
      content: (
        <div>
          <p>Este proyecto quiere crear un sistema inteligente para predecir cuánta lluvia caerá en el Antisana, para así saber cuándo habrá mucha lluvia (y evitar inundaciones) o poca (y cuidar el agua).</p>
          <div className="mission-objectives">
            <h4 className="objectives-title">🎯 Nuestros Objetivos:</h4>
            <div className="objectives-grid">
              <div className="objective-item"><span className="objective-icon">📊</span><span className="objective-text">Estudiar datos climáticos</span></div>
              <div className="objective-item"><span className="objective-icon">🤖</span><span className="objective-text">Usar IA para predicciones</span></div>
              <div className="objective-item"><span className="objective-icon">🗺️</span><span className="objective-text">Mapas interactivos</span></div>
              <div className="objective-item"><span className="objective-icon">🚨</span><span className="objective-text">Alertas tempranas</span></div>
            </div>
          </div>
        </div>
      )
    },
    animales: {
      title: 'Guardianes del Páramo',
      description: 'Conoce a los increíbles habitantes del Antisana',
      imageUrl: '/inicio/animales.png',
      content: (
        <div>
          <p>En el Antisana viven animales asombrosos como el <strong>Oso de Anteojos</strong> y el majestuoso <strong>Cóndor Andino</strong>.</p>
          <p>Ellos dependen del agua del páramo para vivir. ¡Al cuidar el agua, protegemos su hogar!</p>
          <div className="animals-grid">
            <div className="animal-card"><span className="animal-emoji">🐻</span><div className="animal-info"><h5>Oso de Anteojos</h5><p>El único oso de Sudamérica</p></div></div>
            <div className="animal-card"><span className="animal-emoji">🦅</span><div className="animal-info"><h5>Cóndor Andino</h5><p>El ave voladora más grande del mundo</p></div></div>
          </div>
        </div>
      )
    },
    sensores: {
      title: 'Nuestros Sensores Espías',
      description: 'Tecnología que vigila el clima',
      imageUrl: '/inicio/sensores.png',
      content: (
        <div>
          <p>¿Cómo sabemos cuánta lluvia cae? ¡Usamos <strong>sensores inteligentes</strong>!</p>
          <p>Son como pequeños detectives del clima que miden la lluvia, la temperatura y el viento las 24 horas del día.</p>
          <div className="sensors-info">
            <div className="sensor-type"><span className="sensor-icon">🌧️</span><div><h5>Pluviómetros</h5><p>Miden la cantidad de lluvia</p></div></div>
            <div className="sensor-type"><span className="sensor-icon">🌡️</span><div><h5>Termómetros</h5><p>Registran la temperatura</p></div></div>
            <div className="sensor-type"><span className="sensor-icon">💨</span><div><h5>Anemómetros</h5><p>Miden la velocidad del viento</p></div></div>
          </div>
        </div>
      )
    },
    ayuda: {
      title: '¡Conviértete en Guardián del Agua!',
      description: 'Pequeñas acciones, gran impacto',
      imageUrl: '/inicio/cuidar_agua.png',
      content: (
        <div>
          <p>¡Tú también puedes ayudar a cuidar el agua! Cada gotita cuenta para proteger lugares mágicos como el Antisana.</p>
          <div className="tips-container">
            <h4 className="tips-title">💡 Consejos de Superhéroe del Agua:</h4>
            <div className="tips-grid">
              <div className="tip-item"><span className="tip-icon">🚿</span><p>Duchas más cortas (máximo 5 minutos)</p></div>
              <div className="tip-item"><span className="tip-icon">🦷</span><p>Cierra la llave al cepillarte</p></div>
              <div className="tip-item"><span className="tip-icon">🔧</span><p>Repara las fugas inmediatamente</p></div>
              <div className="tip-item"><span className="tip-icon">🪣</span><p>Reutiliza el agua de lluvia</p></div>
            </div>
          </div>
        </div>
      )
    }
  };
  const icons = ["💧", "🔄", "🎯", "🐾", "📡", "🦸"];

  return (
    <div className="info-page-container">
      {/* Esta es la estructura simplificada del Hero Section */}
      <div className="info-hero-section">
        <h1 className="info-hero-title">Un Ecosistema de Información</h1>
        <p className="info-hero-subtitle">Descubre por qué el Antisana es una fuente de vida y cómo la tecnología nos ayuda a protegerlo.</p>
      </div>

      <div className="stats-section">
          <AnimatedStat number={1500} label="Litros de agua por segundo" suffix=" l/s" delay={0} />
          <AnimatedStat number={40} label="Especies de mamíferos" suffix="+" delay={200} />
          <AnimatedStat number={400} label="Tipos de aves" suffix="+" delay={400} />
      </div>

      <div className="cards-container">
        {Object.keys(aboutContent).map((key, index) => (
          <InteractiveCard
            key={key}
            icon={icons[index]}
            title={aboutContent[key].title}
            description={aboutContent[key].description}
            onClick={() => setActiveModal(aboutContent[key])}
            delay={index * 100}
          />
        ))}
      </div>
      
      {activeModal && <InfoModal data={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
