import React, { useEffect, useMemo, useState } from 'react';
import { evidenceLabels, optionLabels, patterns } from '../data/patterns';
import { EvidenceBadge, ModalityList, PatternNumber, SearchIcon, TagList } from '../components/UI';
import { categoryClass, evidenceStrength, facetMatch, matchesFreeText, toggleArrayValue } from '../utils';

function initialParamsFromHash() {
  const query = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  return {
    goal: params.get('goal') || '',
    q: params.get('q') || '',
  };
}

export default function ExplorePatterns({ compareIds, onToggleCompare }) {
  const initial = initialParamsFromHash();
  const [search, setSearch] = useState(initial.q);
  const [goals, setGoals] = useState(initial.goal ? [initial.goal] : []);
  const [modalities, setModalities] = useState([]);
  const [domains, setDomains] = useState([]);
  const [users, setUsers] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [sort, setSort] = useState('id');
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState(patterns[0]?.id || null);

  const results = useMemo(() => {
    const filtered = patterns.filter((pattern) =>
      matchesFreeText(pattern, search)
      && facetMatch(pattern.goals, goals)
      && facetMatch(pattern.modalities, modalities)
      && facetMatch(pattern.domains, domains)
      && facetMatch(pattern.users, users)
      && (!evidence.length || evidence.includes(pattern.evidence))
    );

    return [...filtered].sort((a, b) => {
      if (sort === 'evidence') return evidenceStrength(b.evidence) - evidenceStrength(a.evidence) || a.id - b.id;
      if (sort === 'title') return a.title.localeCompare(b.title, 'es');
      if (sort === 'sources') return b.refIds.length - a.refIds.length || a.id - b.id;
      return a.id - b.id;
    });
  }, [search, goals, modalities, domains, users, evidence, sort]);

  useEffect(() => {
    if (!results.some((pattern) => pattern.id === selectedId)) setSelectedId(results[0]?.id || null);
  }, [results, selectedId]);

  const selectedPattern = results.find((pattern) => pattern.id === selectedId) || results[0] || null;
  const facetActiveCount = goals.length + modalities.length + domains.length + users.length + evidence.length;
  const activeCount = facetActiveCount + (search ? 1 : 0);
  const clearAll = () => {
    setSearch('');
    setGoals([]);
    setModalities([]);
    setDomains([]);
    setUsers([]);
    setEvidence([]);
  };

  const facetCounts = (group, key) => patterns.filter((pattern) => {
    if (group === 'evidence') return pattern.evidence === key;
    return pattern[group].includes(key);
  }).length;

  return (
    <main id="main-content" className="container page explore-page premium-explorer">
      <header className="page-heading-simple">
        <div>
          <p className="kicker">CATÁLOGO</p>
          <h1>Explorar protopatrones</h1>
        </div>
        <p>Busca en el contenido completo o utiliza filtros para refinar el catálogo. Selecciona un resultado para revisar su contenido sin abandonar la página.</p>
      </header>

      <section className="explorer-toolbar" aria-label="Controles de búsqueda del catálogo">
        <label className="explorer-search">
          <SearchIcon />
          <span className="sr-only">Buscar en el catálogo</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por problema, solución, modalidad, métrica o estudio…" />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Borrar búsqueda">×</button>}
        </label>

        <label className="sort-control">
          <span>Orden</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="id">Catálogo</option>
            <option value="evidence">Evidencia</option>
            <option value="sources">Fuentes</option>
            <option value="title">A–Z</option>
          </select>
        </label>
      </section>

      <section className={`filter-drawer ${filtersExpanded ? 'is-open' : 'is-collapsed'}`} aria-label="Filtros del catálogo">
        <div className="filter-drawer-head">
          <div>
            <strong>Filtros</strong>
            <span>{facetActiveCount > 0 ? `${facetActiveCount} ${facetActiveCount === 1 ? 'criterio activo' : 'criterios activos'}` : 'Refina el catálogo por objetivo, modalidad, contexto o evidencia.'}</span>
          </div>
          <div className="filter-head-actions">
            {facetActiveCount > 0 && <button type="button" className="filter-clear" onClick={clearAll}>Limpiar</button>}
            <button
              type="button"
              className="filter-toggle"
              onClick={() => setFiltersExpanded((value) => !value)}
              aria-expanded={filtersExpanded}
              aria-controls="catalog-filter-options"
            >
              <span>{filtersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        {filtersExpanded && (
          <div id="catalog-filter-options" className="filter-drawer-grid">
            <Facet title="Objetivo de diseño" group="goals" labels={optionLabels.goals} selected={goals} onToggle={(key) => setGoals(toggleArrayValue(goals, key))} count={facetCounts} />
            <Facet title="Modalidad sensorial" group="modalities" labels={optionLabels.modalities} selected={modalities} onToggle={(key) => setModalities(toggleArrayValue(modalities, key))} count={facetCounts} />
            <Facet title="Nivel de evidencia" group="evidence" labels={evidenceLabels} selected={evidence} onToggle={(key) => setEvidence(toggleArrayValue(evidence, key))} count={facetCounts} prefix="N.E.E. " />
            <Facet title="Dominio de aplicación" group="domains" labels={optionLabels.domains} selected={domains} onToggle={(key) => setDomains(toggleArrayValue(domains, key))} count={facetCounts} />
            <Facet title="Usuarios" group="users" labels={optionLabels.users} selected={users} onToggle={(key) => setUsers(toggleArrayValue(users, key))} count={facetCounts} />
          </div>
        )}
      </section>

      <div className="explorer-status">
        <p><strong>{results.length}</strong> {results.length === 1 ? 'resultado' : 'resultados'}</p>
        {activeCount > 0 && (
          <div className="active-filter-row compact">
            {search && <button type="button" onClick={() => setSearch('')}>“{search}” ×</button>}
            <ActiveChips values={goals} labels={optionLabels.goals} remove={(key) => setGoals(toggleArrayValue(goals, key))} />
            <ActiveChips values={modalities} labels={optionLabels.modalities} remove={(key) => setModalities(toggleArrayValue(modalities, key))} />
            <ActiveChips values={domains} labels={optionLabels.domains} remove={(key) => setDomains(toggleArrayValue(domains, key))} />
            <ActiveChips values={users} labels={optionLabels.users} remove={(key) => setUsers(toggleArrayValue(users, key))} />
            <ActiveChips values={evidence} labels={evidenceLabels} remove={(key) => setEvidence(toggleArrayValue(evidence, key))} prefix="N.E.E. " />
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-state premium-empty">
          <span>0</span>
          <div><h2>No hay coincidencias con todos los criterios activos.</h2><p>Elimina una faceta o prueba una búsqueda más amplia.</p></div>
          <button type="button" className="button secondary" onClick={clearAll}>Restablecer catálogo</button>
        </div>
      ) : (
        <div className="catalog-browser">
          <section className="catalog-result-list" aria-label="Resultados del catálogo">
            {results.map((pattern) => (
              <button
                type="button"
                key={pattern.id}
                className={`catalog-result ${selectedPattern?.id === pattern.id ? 'selected' : ''} ${categoryClass(pattern.category)}`}
                onClick={() => {
                  setSelectedId(pattern.id);
                  if (window.matchMedia('(max-width: 900px)').matches) {
                    window.requestAnimationFrame(() => {
                      document.querySelector('.catalog-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }
                }}
                aria-pressed={selectedPattern?.id === pattern.id}
              >
                <div className="catalog-result-id"><PatternNumber pattern={pattern} /><span>{pattern.categoryLabel}</span></div>
                <div className="catalog-result-copy"><strong>{pattern.title}</strong><p>{pattern.subtitle}</p></div>
                <div className="catalog-result-meta"><EvidenceBadge level={pattern.evidence} compact /><span>{pattern.refIds.length} {pattern.refIds.length === 1 ? 'fuente' : 'fuentes'}</span></div>
              </button>
            ))}
          </section>

          <aside className="catalog-preview" aria-live="polite">
            {selectedPattern && (
              <div className={`preview-card ${categoryClass(selectedPattern.category)}`}>
                <div className="preview-head">
                  <div>
                    <p className="preview-category">{String(selectedPattern.id).padStart(2, '0')} · {selectedPattern.categoryLabel}</p>
                    <h2>{selectedPattern.title}</h2>
                  </div>
                  <EvidenceBadge level={selectedPattern.evidence} />
                </div>

                <p className="preview-subtitle">{selectedPattern.subtitle}</p>

                <div className="preview-logic">
                  <article><small>PROBLEMA</small><p>{selectedPattern.problem}</p></article>
                  <article><small>SOLUCIÓN</small><p>{selectedPattern.solution}</p></article>
                  <article className="expected"><small>EFECTO ESPERADO</small><p>{selectedPattern.expectedEffect}</p></article>
                </div>

                <div className="preview-metadata">
                  <div><small>Objetivos</small><TagList values={selectedPattern.goals} group="goals" /></div>
                  <div><small>Modalidades</small><ModalityList modalities={selectedPattern.modalities} compact /></div>
                </div>

                <div className="preview-actions">
                  <a className="button primary" href={`#/pattern/${selectedPattern.id}`}>Abrir ficha completa</a>
                  <button
                    type="button"
                    className={`button secondary ${compareIds.includes(selectedPattern.id) ? 'selected' : ''}`}
                    onClick={() => onToggleCompare(selectedPattern.id)}
                  >
                    {compareIds.includes(selectedPattern.id) ? 'Quitar de comparación' : 'Añadir a comparación'}
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

function Facet({ title, group, labels, selected, onToggle, count, prefix = '' }) {
  const headingId = `facet-${group}-title`;
  return (
    <section className={`facet-group premium-facet facet-${group}`} role="group" aria-labelledby={headingId}>
      <div className="facet-heading">
        <h3 id={headingId}>{title}</h3>
        {selected.length > 0 && <span>{selected.length} seleccionados</span>}
      </div>
      <div className="facet-options">
        {Object.entries(labels).map(([key, label]) => (
          <label className="facet-option" key={key}>
            <input type="checkbox" checked={selected.includes(key)} onChange={() => onToggle(key)} />
            <span>{prefix}{label}</span>
            <small>{count(group, key)}</small>
          </label>
        ))}
      </div>
    </section>
  );
}

function ActiveChips({ values, labels, remove, prefix = '' }) {
  return values.map((value) => <button type="button" key={value} onClick={() => remove(value)}>{prefix}{labels[value]} ×</button>);
}
