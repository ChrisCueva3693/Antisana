import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './pages/Inicio';
import Informacion from './pages/Informacion';
import Juegos from './pages/Juegos';
import Mapa from './pages/Mapa';
import Modelos from './pages/Modelos';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/modelos" element={<Modelos />} />
      </Routes>
    </Router>
  );
}

export default App;
