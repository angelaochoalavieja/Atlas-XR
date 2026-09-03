import React, { useEffect, useState } from 'react';

export default function Header({ route, compareCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (key) => route === key || (key === 'explore' && route.startsWith('pattern/'));
  const isHome = !route;

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <header className={`site-header-shell ${menuOpen ? 'menu-open' : ''}`}>
        <div className="site-header container">
          <a className="brand" href="#/" aria-label="Volver al inicio del Atlas XR">
            <span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span>
            <span className="brand-copy">
              <b>Atlas XR</b>
            </span>
          </a>

          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="mobile-nav-icon"><i/><i/><i/></span>
            <span>Menú</span>
          </button>

          <nav id="main-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Navegación principal">
            <a className={`home-nav-button ${isHome ? 'active' : ''}`} href="#/" aria-label="Ir a Inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.7 12 3.8l8.5 6.9v9.1a.7.7 0 0 1-.7.7h-5.1v-6.1H9.3v6.1H4.2a.7.7 0 0 1-.7-.7v-9.1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              <span>Inicio</span>
            </a>
            <a className={isActive('explore') ? 'active' : ''} href="#/explore">Catálogo</a>
            <a className={isActive('find') ? 'active' : ''} href="#/find">Búsqueda guiada</a>
            <a className={`compare-nav ${isActive('compare') ? 'active' : ''}`} href="#/compare">
              Comparar <span aria-label={`${compareCount} seleccionados`}>{compareCount}</span>
            </a>
            <a className={isActive('methodology') ? 'active' : ''} href="#/methodology">Metodología</a>
          </nav>
        </div>
      </header>
    </>
  );
}
