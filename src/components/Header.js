import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <nav className="header">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink>
      <NavLink to="/informacion" className={({ isActive }) => isActive ? 'active' : ''}>Información</NavLink>
      <NavLink to="/juegos" className={({ isActive }) => isActive ? 'active' : ''}>Juegos</NavLink>
      <NavLink to="/mapa" className={({ isActive }) => isActive ? 'active' : ''}>Mapa Antisana</NavLink>
    </nav>
  );
}
