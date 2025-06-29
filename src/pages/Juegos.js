// src/pages/Juegos.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { especies } from '../data/especies';     // ← tu listado de fauna
import { preguntas } from '../data/preguntas';   // ← tu banco de preguntas
import './Juegos.css';                           // ← hoja de estilo creada

/* -------------------------------------------------------------------------- */
/*  Componente raíz: menú + dos juegos                                        */
/* -------------------------------------------------------------------------- */
export default function Juegos() {
  const [pantalla, setPantalla] = useState('menu');   // menu | memoria | quiz

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Juegos Interactivos</h2>

      {pantalla === 'menu'    && <Menu   onSelect={setPantalla} />}
      {pantalla === 'memoria' && <Memorama onBack={() => setPantalla('menu')} />}
      {pantalla === 'quiz'    && <Quiz     onBack={() => setPantalla('menu')} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Menú de selección                                                         */
/* -------------------------------------------------------------------------- */
function Menu({ onSelect }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GameCard
        title="Memorama de Biodiversidad"
        desc ="Empareja las especies icónicas del Antisana."
        onClick={() => onSelect('memoria')}
      />
      <GameCard
        title="Quiz Rápido Antisana"
        desc ="Responde antes de que el tiempo se agote."
        onClick={() => onSelect('quiz')}
      />
    </div>
  );
}

function GameCard({ title, desc, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="border rounded-xl p-6 shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm">{desc}</p>
      <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded flex items-center gap-2">
        <FaPlay /> Jugar
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Juego 1: Memorama de Biodiversidad                                        */
/* -------------------------------------------------------------------------- */
function Memorama({ onBack }) {
  const [cartas,  setCartas ] = useState([]);
  const [flipped, setFlipped] = useState([]);        // índices volteados
  const [matched, setMatched] = useState([]);        // ids acertados

  /* al montar: crea y baraja la baraja */
  useEffect(reiniciar, []);

  function reiniciar() {
    setMatched([]);
    setFlipped([]);
    const baraja = [...especies, ...especies]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, key: i }));           // key único
    setCartas(baraja);
  }

  function voltear(idx) {
    if (flipped.includes(idx) || matched.includes(cartas[idx].id)) return;

    const nuevos = [...flipped, idx];
    setFlipped(nuevos);

    if (nuevos.length === 2) {
      const [a, b] = nuevos;
      if (cartas[a].id === cartas[b].id) {          // ¡pareja!
        setMatched((m) => [...m, cartas[a].id]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  }

  return (
    <section>
      <TopBar title="Memorama de Biodiversidad"
              onBack={onBack}
              onReset={reiniciar} />

      <div className="memorama-grid">
        {cartas.map((c, idx) => {
          const estaVolteada = flipped.includes(idx) || matched.includes(c.id);
          return (
            <div key={c.key}
                 className={`card ${estaVolteada ? 'flipped' : ''}`}
                 onClick={() => voltear(idx)}>
              <div className="card-inner">
                {/* Dorso */}
                <div className="card-face card-front">Antisana</div>

                {/* Imagen */}
                <div className="card-face card-back">
                  <img src={c.img} alt={c.nombre} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {matched.length === especies.length && (
        <p className="mt-3 font-semibold text-green-700">¡Completado! 🎉</p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Juego 2: Quiz Rápido                                                      */
/* -------------------------------------------------------------------------- */
function Quiz({ onBack }) {
  const [idx,   setIdx  ] = useState(0);
  const [score, setScore] = useState(0);
  const [time,  setTime ] = useState(30);           // 30 s para todo el quiz

  useEffect(() => {
    if (time === 0) return;
    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  const q = preguntas[idx];

  function responder(opt) {
    if (opt === q.correcta) setScore((s) => s + 1);
    if (idx + 1 < preguntas.length) setIdx((i) => i + 1);
    else setTime(0);                               // fin del juego
  }

  function reiniciar() {
    setIdx(0); setScore(0); setTime(30);
  }

  /* ---------- Pantalla de resultado ---------- */
  if (time === 0) {
    return (
      <section>
        <TopBar title="Quiz Rápido Antisana" onBack={onBack} onReset={reiniciar} />
        <p className="mt-4 text-lg">
          Obtuviste <b>{score}</b> de {preguntas.length} aciertos
        </p>
      </section>
    );
  }

  /* ---------- Pregunta en curso -------------- */
  return (
    <section>
      <TopBar title="Quiz Rápido Antisana" onBack={onBack} onReset={reiniciar} />

      <p className="text-sm text-gray-600 mb-2">Tiempo: {time}s</p>
      <h3 className="text-base font-medium mb-3">{q.texto}</h3>

      <div className="grid gap-2">
        {q.opciones.map((op, i) => (
          <button key={i}
                  onClick={() => responder(i)}
                  className="border rounded p-2 hover:bg-green-100">
            {op}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Pregunta {idx + 1} / {preguntas.length}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Barra superior reutilizable (atrás + título + reiniciar)                  */
/* -------------------------------------------------------------------------- */
function TopBar({ title, onBack, onReset }) {
  return (
    <div className="topbar">
      <button onClick={onBack}><FaArrowLeft /> Atrás</button>
      <h3 className="font-semibold">{title}</h3>
      <button onClick={onReset}><FaRedo /> Reiniciar</button>
    </div>
  );
}
