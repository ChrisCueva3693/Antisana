import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efecto para detectar scroll y cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para cerrar el menú móvil al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo y título */}
        <div className="header-brand">
          <div className="logo-container">
            <div className="logo-mountain">🏔️</div>
            <div className="logo-text">
              <span className="logo-title">ANTISANA</span>
              <span className="logo-subtitle">Guardián del Agua</span>
            </div>
          </div>
        </div>

        {/* Navegación desktop */}
        <nav className="nav-desktop">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Inicio</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/informacion" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-text">Información</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/juegos" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">🎮</span>
                <span className="nav-text">Juegos</span>
              </NavLink>
            </li>
            {/* --- INICIO DE LA MODIFICACIÓN --- */}
            <li className="nav-item">
              <NavLink 
                to="/modelos" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">💻</span>
                <span className="nav-text">Modelos</span>
              </NavLink>
            </li>
            {/* --- FIN DE LA MODIFICACIÓN --- */}
            <li className="nav-item">
              <NavLink 
                to="/mapa" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">🗺️</span>
                <span className="nav-text">Mapa</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Botón del menú móvil */}
        <button 
          className={`mobile-menu-button ${isMobileMenuOpen ? 'mobile-menu-button-open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de navegación"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navegación móvil */}
        <nav className={`nav-mobile ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
          <ul className="nav-mobile-list">
            <li className="nav-mobile-item">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'nav-mobile-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-mobile-icon">🏠</span>
                <span className="nav-mobile-text">Inicio</span>
              </NavLink>
            </li>
            <li className="nav-mobile-item">
              <NavLink 
                to="/informacion" 
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'nav-mobile-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-mobile-icon">📚</span>
                <span className="nav-mobile-text">Información</span>
              </NavLink>
            </li>
            <li className="nav-mobile-item">
              <NavLink 
                to="/juegos" 
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'nav-mobile-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-mobile-icon">🎮</span>
                <span className="nav-mobile-text">Juegos</span>
              </NavLink>
            </li>
            {/* --- INICIO DE LA MODIFICACIÓN --- */}
            <li className="nav-mobile-item">
              <NavLink 
                to="/modelos" 
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'nav-mobile-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-mobile-icon">💻</span>
                <span className="nav-mobile-text">Modelos</span>
              </NavLink>
            </li>
            {/* --- FIN DE LA MODIFICACIÓN --- */}
            <li className="nav-mobile-item">
              <NavLink 
                to="/mapa" 
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'nav-mobile-link-active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-mobile-icon">🗺️</span>
                <span className="nav-mobile-text">Mapa</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Overlay para cerrar el menú móvil */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
}
