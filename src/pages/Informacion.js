import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Informacion.css';

// --- Componente para el Modal (Ventana Emergente) Corregido ---
const InfoModal = ({ data, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  // Usamos useCallback para que la función no se recree en cada render,
  // y la pasamos como dependencia al useEffect.
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
        onClose();
    }, 400); // Esperamos que la animación de salida termine
  }, [onClose]);

  // Este useEffect maneja el scroll del body y la tecla 'Escape'.
  // Ahora se ejecuta solo cuando 'data' o 'handleClose' cambian.
  useEffect(() => {
    // Solo aplicamos los efectos si el modal está visible (si hay 'data')
    if (data) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);

      // Función de limpieza que se ejecuta cuando el componente se desmonta
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [data, handleClose]); // Dependencias del Hook

  // El return condicional ahora está DESPUÉS de todos los hooks.
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


// --- Componente para las Tarjetas Interactivas Mejoradas ---
const InteractiveCard = ({ icon, title, description, onClick, delay, isSpecial = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`info-card ${isSpecial ? 'info-card-special' : ''}`}
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


// --- Componente para Estadísticas Animadas Corregido ---
const AnimatedStat = ({ number, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const statRef = useRef(null); // Usamos useRef para obtener la referencia al elemento del DOM

  useEffect(() => {
    const element = statRef.current; // Copiamos la referencia a una variable local
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
                
                observer.unobserve(element); // Dejamos de observar una vez que la animación comienza
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      // Usamos la variable local en la función de limpieza
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [number]); // La dependencia es el número que va a contar

  return (
    <div ref={statRef} className="animated-stat" style={{animationDelay: `${delay}ms`}}>
      <span className="stat-number">{Math.floor(count)}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};


// --- Componente Principal de la Página de Información (sin cambios) ---
export default function Informacion() {
  const [activeModal, setActiveModal] = useState(null);

  const aboutContent = {
    agua: {
      title: '¿De dónde viene el agua?',
      description: 'Descubre el secreto del páramo andino',
      imageUrl: 'https://www.escapetoursecuador.com/wp-content/uploads/2020/07/paramo-antisana-scaled.jpg',
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
      imageUrl: 'https://www.mundoprimaria.com/wp-content/uploads/2019/07/ciclo-del-agua-para-ni%C3%B1os.jpg',
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
      imageUrl: 'https://i0.wp.com/sinia.go.cr/wp-content/uploads/2022/02/sensores-remotos-scaled.jpg?fit=2560%2C1920&ssl=1',
      content: (
        <div>
          <p className="mb-4">Este proyecto quiere crear un sistema inteligente para predecir cuánta lluvia caerá en el Antisana, para así saber cuándo habrá mucha lluvia (y evitar inundaciones) o poca (y cuidar el agua).</p>
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
      imageUrl: 'https://www.worldanimalprotection.org/sites/default/files/styles/1200x630/public/media/int_files/735201.jpg?itok=3u-g_B1j',
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
      imageUrl: 'https://www.ambientum.com/wp-content/uploads/2018/12/estacion-meteorologica-696x464.jpg',
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
      imageUrl: 'https://img.freepik.com/vector-premium/nino-lindo-feliz-cierra-grifo-agua_97632-2361.jpg',
      content: (
        <div>
          <p className="mb-4">¡Tú también puedes ayudar a cuidar el agua! Cada gotita cuenta para proteger lugares mágicos como el Antisana.</p>
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
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
            <h1 className="hero-title">Un Ecosistema de Información</h1>
            <p className="hero-subtitle">Descubre por qué el Antisana es una fuente de vida y cómo la tecnología nos ayuda a protegerlo.</p>
        </div>
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
            isSpecial={key === 'ayuda'}
          />
        ))}
      </div>
      
      {activeModal && <InfoModal data={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
