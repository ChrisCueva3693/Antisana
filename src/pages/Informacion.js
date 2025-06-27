import React, { useState } from 'react';
import './Informacion.css'; // Crearemos este archivo para los estilos y animaciones

// --- Componente para el Modal (Ventana Emergente) ---
const InfoModal = ({ data, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  if (!data) return null;

  const handleClose = () => {
      setIsExiting(true);
      // Espera a que termine la animación de salida para cerrar
      setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`} 
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 overflow-hidden transform transition-all duration-300 ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`} 
        onClick={e => e.stopPropagation()}
      >
        <img src={data.imageUrl} alt={data.title} className="w-full h-56 object-cover"/>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-[#1e392a] mb-4">{data.title}</h2>
            <div className="text-gray-700 space-y-4">{data.content}</div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleClose} className="bg-[#c29346] hover:bg-[#a57c39] text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Entendido
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente para las Tarjetas Clickeables ---
const ClickableCard = ({ icon, title, onClick, delay }) => (
  <div 
      className="bg-[#1e392a] rounded-xl shadow-lg p-6 hover:bg-[#3a5a40] transform hover:-translate-y-2 transition-all duration-300 cursor-pointer text-white clickable-card-animation"
      style={{animationDelay: `${delay}ms`}}
      onClick={onClick}
  >
    <div className="flex flex-col items-center text-center">
      <span className="text-5xl mb-4 text-[#c29346]">{icon}</span>
      <h3 className="text-xl font-bold h-12">{title}</h3>
      <p className="text-[#c29346] font-semibold mt-2">Saber más...</p>
    </div>
  </div>
);

// --- Componente Principal de la Página de Información ---
export default function Informacion() {
  const [activeModal, setActiveModal] = useState(null);

  // Contenido para cada tarjeta y modal
  const aboutContent = {
      agua: { title: '¿De dónde viene el agua?', imageUrl: 'https://www.escapetoursecuador.com/wp-content/uploads/2020/07/paramo-antisana-scaled.jpg', content: <p>Imagina una esponja gigante en lo alto de una montaña. Esa esponja es el <strong>Páramo del Antisana</strong>. Cuando llueve o las nubes chocan con la montaña, el páramo atrapa toda esa agua, la limpia y la guarda. Luego, la libera poquito a poquito para formar los ríos que llevan el agua hasta tu casa.</p> },
      ciclo: { title: 'El increíble viaje del agua', imageUrl: 'https://www.mundoprimaria.com/wp-content/uploads/2019/07/ciclo-del-agua-para-ni%C3%B1os.jpg', content: <p>El agua es una gran viajera. El sol la calienta y la hace subir al cielo como vapor. Allá arriba, se junta en las nubes y, cuando están muy llenas, el agua cae como lluvia. A este viaje se le llama <strong>ciclo del agua</strong>.</p> },
      mision: { title: 'La Misión de Nuestro Proyecto', imageUrl: 'https://i0.wp.com/sinia.go.cr/wp-content/uploads/2022/02/sensores-remotos-scaled.jpg?fit=2560%2C1920&ssl=1', content: (<div><p className="mb-4">Este proyecto quiere crear un sistema para "adivinar" cuánta lluvia caerá en el Antisana, para así saber cuándo habrá mucha lluvia (y evitar inundaciones) o muy poquita (y cuidar el agua).</p><h4 className="font-bold">Nuestros Objetivos:</h4><ul className="list-disc list-inside mt-1 space-y-1"><li>Estudiar los datos del clima.</li><li>Usar computadoras para predecir la lluvia.</li><li>Mostrar las predicciones en mapas y gráficos fáciles.</li><li>Crear alertas para tomar buenas decisiones.</li></ul></div>) },
      animales: { title: 'Guardianes del Páramo', imageUrl: 'https://www.worldanimalprotection.org/sites/default/files/styles/1200x630/public/media/int_files/735201.jpg?itok=3u-g_B1j', content: <p>En el Antisana viven animales asombrosos como el <strong>Oso de Anteojos</strong> y el majestuoso <strong>Cóndor Andino</strong>. Ellos dependen del agua del páramo para vivir. ¡Al cuidar el agua, protegemos su hogar!</p> },
      sensores: { title: 'Nuestros Sensores Espías', imageUrl: 'https://www.ambientum.com/wp-content/uploads/2018/12/estacion-meteorologica-696x464.jpg', content: <p>¿Cómo sabemos cuánta lluvia cae? ¡Usamos <strong>sensores</strong>! Son como pequeños detectives del clima que miden la lluvia, la temperatura y el viento. Los puntos en nuestro mapa son donde están estos "espías", dándonos la información para las predicciones.</p> },
      ayuda: { title: '¡Conviértete en Guardián del Agua!', imageUrl: 'https://img.freepik.com/vector-premium/nino-lindo-feliz-cierra-grifo-agua_97632-2361.jpg', content: (<div><p className="mb-4">¡Tú también puedes ayudar a cuidar el agua! Cada gotita cuenta. Aquí tienes algunas ideas:</p><ul className="list-disc list-inside mt-1 space-y-1"><li>Cierra la llave mientras te cepillas los dientes.</li><li>Toma duchas más cortas.</li><li>Dile a tus papás si ves alguna fuga de agua en casa.</li></ul></div>) }
  };
  const icons = ["💧", "🔄", "🎯", "🐾", "📡", "🦸"];


  return (
    <div className="animated-background w-full min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-4xl font-bold text-[#1e392a] mb-2">Un Viaje para Entender el Agua</h2>
          <p className="text-lg text-gray-600">Haz clic en cada tema para descubrir por qué el Antisana es un lugar mágico y tan importante.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {Object.keys(aboutContent).map((key, index) => (
            <ClickableCard 
              key={key} 
              icon={icons[index]} 
              title={aboutContent[key].title} 
              onClick={() => setActiveModal(aboutContent[key])} 
              delay={index * 100} 
            />
          ))}
        </div>
      </div>
      {activeModal && <InfoModal data={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
