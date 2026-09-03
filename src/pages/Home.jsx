import React from 'react';
import PatternLandscape from '../components/PatternLandscape';
import { allReferenceIds, evidenceDefinitions, optionLabels, patterns } from '../data/patterns';
import { EvidenceBadge } from '../components/UI';

export default function Home() {
  const evidenceCounts = ['I', 'II', 'III'].map((level) => ({
    level,
    count: patterns.filter((pattern) => pattern.evidence === level).length,
  }));

  return (
    <main id="main-content" className="home-page">
      <section className="container home-choice">
        <div className="home-choice-intro">
          <p className="kicker">ATLAS XR</p>
          <h1>Catálogo de protopatrones de diseño para sistemas XR multisensoriales y corporizados</h1>
          <p>
            El catálogo reúne soluciones de diseño extraídas de la literatura revisada y las organiza para facilitar su consulta, comparación y reutilización ante problemas de interacción similares.
          </p>
        </div>

        <div className="home-search-heading">
          <p className="kicker">FORMAS DE CONSULTA</p>
          <h2>¿Cómo quieres buscar?</h2>
          <p>Elige la estrategia que mejor encaje con lo que ya sabes sobre tu problema de diseño.</p>
        </div>

        <div className="search-mode-grid" aria-label="Tipos de búsqueda disponibles">
          <a className="search-mode-card" href="#/explore">
            <span className="search-mode-number">01</span>
            <div>
              <p className="search-mode-label">EXPLORACIÓN DIRECTA</p>
              <h2>Explorar el catálogo</h2>
              <p>Úsala si quieres revisar los protopatrones directamente, buscar términos concretos o combinar filtros por objetivo, modalidad, dominio, usuarios y evidencia.</p>
            </div>
            <span className="search-mode-action">Ir al catálogo <b aria-hidden="true">→</b></span>
          </a>

          <a className="search-mode-card" href="#/find">
            <span className="search-mode-number">02</span>
            <div>
              <p className="search-mode-label">BÚSQUEDA GUIADA</p>
              <h2>Encontrar un protopatrón</h2>
              <p>Úsala si partes de una necesidad de diseño. Indica qué quieres conseguir y, opcionalmente, usuarios, modalidades y dominio para obtener coincidencias justificadas.</p>
            </div>
            <span className="search-mode-action">Iniciar búsqueda guiada <b aria-hidden="true">→</b></span>
          </a>
        </div>

        <div className="home-corpus-strip" aria-label="Resumen del corpus">
          <span><strong>{patterns.length}</strong> protopatrones</span>
          <span><strong>{allReferenceIds.length}</strong> publicaciones citadas</span>
          <span><strong>{Object.keys(optionLabels.modalities).length}</strong> modalidades</span>
          <span><strong>{Object.keys(optionLabels.goals).length}</strong> objetivos de diseño</span>
          <a href="#/methodology">Metodología y criterios →</a>
        </div>
      </section>

      <section className="container home-browse" aria-labelledby="browse-goals-title">
        <div className="section-head minimal">
          <div>
            <p className="kicker">ENTRADA POR TAREA</p>
            <h2 id="browse-goals-title">Buscar por objetivo de diseño</h2>
            <p className="section-intro">Si ya sabes qué aspecto de la experiencia XR quieres mejorar, puedes entrar directamente por ese objetivo.</p>
          </div>
          <a className="text-link" href="#/explore">Ver catálogo completo →</a>
        </div>

        <div className="goal-directory">
          {Object.entries(optionLabels.goals).map(([value, label], index) => {
            const count = patterns.filter((pattern) => pattern.goals.includes(value)).length;
            return (
              <a key={value} href={`#/explore?goal=${value}`}>
                <span className="goal-index">{String(index + 1).padStart(2, '0')}</span>
                <strong>{label}</strong>
                <small>{count} {count === 1 ? 'protopatrón' : 'protopatrones'}</small>
                <span className="goal-arrow" aria-hidden="true">→</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="home-insight-band">
        <div className="container home-insight-grid">
          <div className="evidence-panel">
            <div className="section-head minimal light">
              <div><p className="kicker">RESPALDO EMPÍRICO</p><h2>Niveles de evidencia</h2></div>
            </div>
            <div className="evidence-compact-list">
              {evidenceCounts.map(({ level, count }) => (
                <article key={level}>
                  <div><EvidenceBadge level={level} /><strong>{count}</strong></div>
                  <p>{evidenceDefinitions[level]}</p>
                </article>
              ))}
            </div>
            <a className="light-link" href="#/methodology?section=method-evidence">Ver cómo se determina el N.E.E. →</a>
          </div>

          <div className="map-panel">
            <div className="section-head minimal light">
              <div><p className="kicker">MAPA DEL CORPUS</p><h2>Patrones × modalidades</h2></div>
            </div>
            <p className="map-intro">Vista general de los canales sensoriales o corporizados presentes en cada solución documentada.</p>
            <PatternLandscape items={patterns} compact />
          </div>
        </div>
      </section>
    </main>
  );
}
