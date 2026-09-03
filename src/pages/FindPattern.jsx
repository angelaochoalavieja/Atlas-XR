import React, { useMemo, useState } from 'react';
import { optionLabels, patterns } from '../data/patterns';
import { CheckIcon, EvidenceBadge, InfoCallout } from '../components/UI';
import { computeGuidedMatch, toggleArrayValue } from '../utils';

export default function FindPattern({ compareIds, onToggleCompare }) {
  const [goal, setGoal] = useState('');
  const [user, setUser] = useState('');
  const [modalities, setModalities] = useState([]);
  const [domain, setDomain] = useState('');

  const criteria = { goal, user, modalities, domain };
  const hasCriteria = Boolean(goal || user || modalities.length || domain);

  const recommendations = useMemo(() => {
    if (!goal) return [];
    return patterns
      .map((pattern) => ({ pattern, ...computeGuidedMatch(pattern, criteria) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.percent - a.percent || b.score - a.score || a.pattern.id - b.pattern.id)
      .slice(0, 6);
  }, [goal, user, modalities, domain]);

  const reset = () => {
    setGoal('');
    setUser('');
    setModalities([]);
    setDomain('');
  };

  return (
    <main id="main-content" className="container page guided-page premium-guided">
      <header className="page-heading-simple">
        <div><p className="kicker">BÚSQUEDA GUIADA</p><h1>Encontrar un protopatrón</h1></div>
        <p>Selecciona qué quieres conseguir y añade, si lo necesitas, información sobre usuarios, modalidades y dominio. La web ordena los protopatrones según la coincidencia con esos criterios.</p>
      </header>

      <div className="guided-premium-layout">
        <section className="brief-builder" aria-label="Criterios de búsqueda">
          <div className="brief-head">
            <div><strong>Define lo que necesitas</strong><span>Selecciona primero un objetivo de diseño, que es obligatorio. Los demás criterios son opcionales y sirven para hacer la búsqueda más específica.</span></div>
            {hasCriteria && <button type="button" onClick={reset}>Restablecer</button>}
          </div>

          <BriefSection number="01" title="Objetivo de diseño" required>
            <ChoicePills labels={optionLabels.goals} value={goal} onChange={setGoal} />
          </BriefSection>

          <BriefSection number="02" title="Usuarios" hint="Opcional">
            <ChoicePills labels={optionLabels.users} value={user} onChange={(value) => setUser(value === user ? '' : value)} />
          </BriefSection>

          <BriefSection number="03" title="Modalidades disponibles" hint="Opcional · Puedes seleccionar varias">
            <MultiChoicePills labels={optionLabels.modalities} values={modalities} onToggle={(key) => setModalities(toggleArrayValue(modalities, key))} />
          </BriefSection>

          <BriefSection number="04" title="Dominio de aplicación" hint="Opcional">
            <ChoicePills labels={optionLabels.domains} value={domain} onChange={(value) => setDomain(value === domain ? '' : value)} />
          </BriefSection>


          <details className="ranking-details">
            <summary>Cómo se ordenan los resultados</summary>
            <div className="ranking-explanation">
              <p><strong>El objetivo de diseño es obligatorio y constituye el criterio principal.</strong> Después se tienen en cuenta los usuarios, las modalidades seleccionadas y el dominio de aplicación.</p>
              <p>Cuantos más criterios coincidan con un protopatrón, mayor será su porcentaje de coincidencia. El <strong>N.E.E. no modifica este porcentaje</strong>: se muestra por separado para indicar cuánto respaldo empírico tiene cada protopatrón dentro del corpus.</p>
            </div>
          </details>
        </section>

        <aside className="live-match-panel" aria-live="polite">
          <div className="live-match-head">
            <div><p className="kicker">COINCIDENCIAS</p><h2>{recommendations.length ? `${recommendations.length} protopatrones` : 'Aún sin resultados'}</h2></div>
            {recommendations.length > 0 && <small>Ordenados por coincidencia con tus criterios</small>}
          </div>

          {!recommendations.length ? (
            <div className="guided-placeholder">
              <span>→</span>
              <h3>Empieza seleccionando un objetivo.</h3>
              <p>Puedes añadir después usuarios, modalidades y dominio para hacer la búsqueda más específica.</p>
            </div>
          ) : (
            <div className="live-match-list">
              {recommendations.map((item, index) => (
                <article className="live-match-row" key={item.pattern.id}>
                  <div className="match-rank"><span>{index + 1}</span><strong>{item.percent}%</strong></div>
                  <div className="match-copy">
                    <div className="match-title-row"><h3>{item.pattern.title}</h3><EvidenceBadge level={item.pattern.evidence} compact /></div>
                    <p>{item.pattern.subtitle}</p>
                    <ul>{item.reasons.slice(0, 3).map((reason) => <li key={reason}><CheckIcon /> {reason}</li>)}</ul>
                    {item.misses.length > 0 && <details><summary>Ver diferencias</summary><ul className="miss-list">{item.misses.map((miss) => <li key={miss}>{miss}</li>)}</ul></details>}
                    <div className="match-actions">
                      <a className="text-link" href={`#/pattern/${item.pattern.id}`}>Abrir ficha →</a>
                      <button type="button" className="compare-button" onClick={() => onToggleCompare(item.pattern.id)}>
                        {compareIds.includes(item.pattern.id) ? 'Quitar de comparación' : 'Comparar'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {recommendations.length > 0 && (
            <InfoCallout title="Cómo interpretar el porcentaje" tone="neutral">
              <p>El porcentaje resume cuánto coincide cada protopatrón con los criterios que has seleccionado. El N.E.E. se presenta aparte y no aumenta ni reduce la coincidencia. El porcentaje no estima eficacia ni probabilidad de éxito de una futura implementación.</p>
            </InfoCallout>
          )}
        </aside>
      </div>
    </main>
  );
}

function BriefSection({ number, title, hint, required = false, children }) {
  return (
    <fieldset className="brief-section">
      <legend className="sr-only">{number}. {title}</legend>
      <div className="brief-section-heading" aria-hidden="true">
        <span>{number}</span><b>{title}</b>{required && <em>Obligatorio</em>}{hint && <small>{hint}</small>}
      </div>
      {children}
    </fieldset>
  );
}

function ChoicePills({ labels, value, onChange }) {
  return (
    <div className="choice-pills">
      {Object.entries(labels).map(([key, label]) => (
        <button type="button" key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(key)} aria-pressed={value === key}>
          {label}
        </button>
      ))}
    </div>
  );
}

function MultiChoicePills({ labels, values, onToggle }) {
  return (
    <div className="choice-pills multi">
      {Object.entries(labels).map(([key, label]) => (
        <button type="button" key={key} className={values.includes(key) ? 'selected' : ''} onClick={() => onToggle(key)} aria-pressed={values.includes(key)}>
          {values.includes(key) && <CheckIcon />} {label}
        </button>
      ))}
    </div>
  );
}
