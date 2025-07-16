import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- INICIO DE LA CORRECCIÓN ---
// Se añaden los iconos que faltaban: FaBrain, FaQuestionCircle, y FaLeaf
import { FaPlay, FaArrowLeft, FaRedo, FaBrain, FaQuestionCircle, FaLeaf } from 'react-icons/fa';
// --- FIN DE LA CORRECCIÓN ---
import { especies } from '../data/especies';
import { preguntas } from '../data/preguntas';
import './Juegos.css';

/* -------------------------------------------------------------------------- */
/*  Componente raíz: menú + dos juegos                                       */
/* -------------------------------------------------------------------------- */
export default function Juegos() {
  const [pantalla, setPantalla] = useState('menu'); // menu | memoria | quiz

  return (
    <div className="juegos-page-container">
      <AnimatePresence mode="wait">
        {pantalla === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Menu onSelect={setPantalla} />
          </motion.div>
        )}
        {pantalla === 'memoria' && (
          <motion.div key="memoria" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <Memorama onBack={() => setPantalla('menu')} />
          </motion.div>
        )}
        {pantalla === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <Quiz onBack={() => setPantalla('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Menú de selección                                                         */
/* -------------------------------------------------------------------------- */
function Menu({ onSelect }) {
  return (
    <>
      <div className="juegos-hero-section">
        <h1 className="juegos-hero-title">Juegos Interactivos</h1>
        <p className="juegos-hero-subtitle">Pon a prueba tus conocimientos sobre el Antisana y su biodiversidad.</p>
      </div>
      <div className="game-menu-container">
        <GameCard
          title="Memorama de Biodiversidad"
          desc="Empareja las especies icónicas del Antisana y ejercita tu memoria."
          icon={<FaBrain />}
          onClick={() => onSelect('memoria')}
        />
        <GameCard
          title="Quiz Rápido Antisana"
          desc="Responde preguntas sobre el ecosistema antes de que el tiempo se agote."
          icon={<FaQuestionCircle />}
          onClick={() => onSelect('quiz')}
        />
      </div>
    </>
  );
}

function GameCard({ title, desc, icon, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}
      className="game-card"
      onClick={onClick}
    >
      <div className="game-card-icon">{icon}</div>
      <h3 className="game-card-title">{title}</h3>
      <p className="game-card-desc">{desc}</p>
      <div className="game-card-button">
        <FaPlay /> Jugar ahora
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Juego 1: Memorama de Biodiversidad                                        */
/* -------------------------------------------------------------------------- */
function Memorama({ onBack }) {
  const [cartas, setCartas] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [movimientos, setMovimientos] = useState(0);

  useEffect(reiniciar, []);

  function reiniciar() {
    setMatched([]);
    setFlipped([]);
    setMovimientos(0);
    const baraja = [...especies, ...especies]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, key: i }));
    setCartas(baraja);
  }

  function voltear(idx) {
    if (flipped.length >= 2 || flipped.includes(idx) || matched.includes(cartas[idx].id)) return;

    const nuevos = [...flipped, idx];
    setFlipped(nuevos);

    if (nuevos.length === 2) {
      setMovimientos(m => m + 1);
      const [a, b] = nuevos;
      if (cartas[a].id === cartas[b].id) {
        setMatched((m) => [...m, cartas[a].id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }

  const isGameComplete = matched.length === especies.length;

  return (
    <section className="game-container">
      <TopBar title="Memorama de Biodiversidad" onBack={onBack} onReset={reiniciar} />
      <div className="game-stats">Movimientos: {movimientos}</div>
      <div className="memorama-grid">
        {cartas.map((c, idx) => {
          const estaVolteada = flipped.includes(idx) || matched.includes(c.id);
          return (
            <div key={c.key} className="card-container" onClick={() => voltear(idx)}>
              <motion.div className={`card-inner ${estaVolteada ? 'flipped' : ''}`}>
                <div className="card-face card-front">
                  <FaLeaf />
                </div>
                <div className="card-face card-back">
                  <img src={c.img} alt={c.nombre} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {isGameComplete && (
          <motion.div
            className="completion-message"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            ¡Completado! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Juego 2: Quiz Rápido                                                      */
/* -------------------------------------------------------------------------- */
function Quiz({ onBack }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [answered, setAnswered] = useState(null); // { option: index, correct: boolean }

  useEffect(() => {
    if (time === 0 || idx >= preguntas.length) return;
    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time, idx]);

  const q = preguntas[idx];

  function responder(optIndex) {
    if (answered) return; // No permitir responder de nuevo

    const esCorrecta = optIndex === q.correcta;
    if (esCorrecta) setScore((s) => s + 1);
    setAnswered({ option: optIndex, correct: esCorrecta });

    setTimeout(() => {
      setAnswered(null);
      if (idx + 1 < preguntas.length) {
        setIdx((i) => i + 1);
      } else {
        setTime(0); // Fin del juego
      }
    }, 1200);
  }

  function reiniciar() {
    setIdx(0);
    setScore(0);
    setTime(30);
    setAnswered(null);
  }

  const isGameOver = time === 0 || idx >= preguntas.length;

  if (isGameOver) {
    return (
      <section className="game-container quiz-results">
        <TopBar title="Quiz Rápido Antisana" onBack={onBack} onReset={reiniciar} />
        <div className="results-content">
            <h3 className="results-title">¡Juego Terminado!</h3>
            <p className="results-score">
            Obtuviste <b>{score}</b> de {preguntas.length} aciertos
            </p>
            <div className="results-trophy">🏆</div>
        </div>
      </section>
    );
  }

  return (
    <section className="game-container">
      <TopBar title="Quiz Rápido Antisana" onBack={onBack} onReset={reiniciar} />
      <div className="quiz-header">
        <div className="quiz-progress-info">
            Pregunta {idx + 1} / {preguntas.length}
        </div>
        <div className="quiz-timer">Tiempo: {time}s</div>
      </div>
      <div className="timer-bar-container">
        <motion.div 
            className="timer-bar" 
            initial={{ width: '100%' }}
            animate={{ width: `${(time / 30) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
        />
      </div>
      <h3 className="quiz-question">{q.texto}</h3>
      <div className="quiz-options">
        {q.opciones.map((op, i) => {
          let buttonClass = 'quiz-option-btn';
          if (answered) {
            if (i === q.correcta) {
              buttonClass += ' correct';
            } else if (i === answered.option) {
              buttonClass += ' incorrect';
            }
          }
          return (
            <motion.button 
                key={i}
                whileHover={{ scale: answered ? 1 : 1.05 }}
                whileTap={{ scale: answered ? 1 : 0.95 }}
                onClick={() => responder(i)}
                className={buttonClass}
                disabled={!!answered}
            >
              {op}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Barra superior reutilizable                                               */
/* -------------------------------------------------------------------------- */
function TopBar({ title, onBack, onReset }) {
  return (
    <div className="top-bar">
      <button onClick={onBack} className="top-bar-btn">
        <FaArrowLeft /> Atrás
      </button>
      <h3 className="top-bar-title">{title}</h3>
      <button onClick={onReset} className="top-bar-btn">
        <FaRedo /> Reiniciar
      </button>
    </div>
  );
}
