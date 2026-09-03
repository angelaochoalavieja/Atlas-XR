import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import CompareTray from './components/CompareTray';
import Home from './pages/Home';
import ExplorePatterns from './pages/ExplorePatterns';
import FindPattern from './pages/FindPattern';
import PatternDetail from './pages/PatternDetail';
import Methodology from './pages/Methodology';
import ComparePatterns from './pages/ComparePatterns';
import { readHashRoute } from './utils';

export default function App() {
  // La aplicación siempre comienza en Inicio. Las rutas internas se activan
  // únicamente después de que el usuario navega dentro de la sesión actual.
  const [{ route, query }, setLocation] = useState({ route: '', query: new URLSearchParams() });
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('xr-compare') || '[]');
      return Array.isArray(stored) ? stored.slice(0, 3) : [];
    } catch { return []; }
  });

  useEffect(() => {
    const onHashChange = () => {
      setLocation(readHashRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    // Evita que el navegador restaure el último protopatrón visitado al abrir
    // de nuevo la aplicación: la entrada del catálogo es siempre Inicio.
    window.history.replaceState(null, '', '#/');
    setLocation({ route: '', query: new URLSearchParams() });

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('xr-compare', JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleCompare = (id) => setCompareIds((current) => {
    if (current.includes(id)) return current.filter((item) => item !== id);
    if (current.length >= 3) return [...current.slice(1), id];
    return [...current, id];
  });

  const shared = { compareIds, onToggleCompare: toggleCompare };
  let page = <Home {...shared} />;
  if (route === 'explore') page = <ExplorePatterns {...shared} />;
  else if (route === 'find') page = <FindPattern {...shared} />;
  else if (route === 'methodology') page = <Methodology query={query} />;
  else if (route === 'compare') page = <ComparePatterns {...shared} />;
  else if (route.startsWith('pattern/')) page = <PatternDetail id={route.split('/')[1]} query={query} {...shared} />;

  return (
    <>
      <Header route={route} compareCount={compareIds.length} />
      {page}
      {route !== 'compare' && <CompareTray compareIds={compareIds} onRemove={toggleCompare} onClear={() => setCompareIds([])} />}
    </>
  );
}
