import React from 'react';
import { evidenceLabels, patterns } from '../data/patterns';
import { EvidenceBadge, ModalityList, TagList } from '../components/UI';

export default function ComparePatterns({ compareIds, onToggleCompare }) {
  const selected = compareIds.map((id) => patterns.find((pattern) => pattern.id === id)).filter(Boolean);
  const available = patterns.filter((pattern) => !compareIds.includes(pattern.id));

  return (
    <main id="main-content" className="container page compare-page premium-compare">
      <header className="page-heading-simple">
        <div><p className="kicker">COMPARACIÓN</p><h1>Comparar protopatrones</h1></div>
        <p>Contrasta hasta tres fichas en paralelo. La comparación es descriptiva: ayuda a localizar diferencias de contexto, evidencia y compromisos, no a declarar un patrón “mejor”.</p>
      </header>

      {selected.length < 3 && (
        <div className="compare-addbar">
          <label>Añadir un protopatrón
            <select defaultValue="" onChange={(event) => { if (event.target.value) onToggleCompare(Number(event.target.value)); event.target.value = ''; }}>
              <option value="">Elegir del catálogo…</option>
              {available.map((pattern) => <option value={pattern.id} key={pattern.id}>{String(pattern.id).padStart(2,'0')} · {pattern.title}</option>)}
            </select>
          </label>
          <span>{selected.length}/3 seleccionados</span>
        </div>
      )}

      {!selected.length ? (
        <div className="empty-state premium-empty compare-empty">
          <span>⇄</span>
          <div><h2>No hay protopatrones seleccionados.</h2><p>Añade hasta tres desde esta página o usa el botón Comparar mientras exploras el catálogo.</p></div>
          <a className="button primary" href="#/explore">Explorar catálogo</a>
        </div>
      ) : (
        <>
          <div className="comparison-mobile" aria-label="Comparación de protopatrones">
            {selected.map((pattern) => (
              <article className="comparison-mobile-card" key={pattern.id}>
                <header>
                  <div>
                    <span>{String(pattern.id).padStart(2,'0')} · {pattern.categoryLabel}</span>
                    <h2>{pattern.title}</h2>
                  </div>
                  <button type="button" onClick={() => onToggleCompare(pattern.id)}>Quitar ×</button>
                </header>
                <MobileCompareField label="Evidencia"><EvidenceBadge level={pattern.evidence}/><p className="compare-note">{evidenceLabels[pattern.evidence]}</p></MobileCompareField>
                <MobileCompareField label="Modalidades"><ModalityList modalities={pattern.modalities} compact /></MobileCompareField>
                <MobileCompareField label="Objetivos"><TagList values={pattern.goals} group="goals" /></MobileCompareField>
                <MobileCompareField label="Dominios"><TagList values={pattern.domains} group="domains" /></MobileCompareField>
                <MobileCompareField label="Usuarios"><TagList values={pattern.users} group="users" /></MobileCompareField>
                <MobileCompareField label="Problema"><p>{pattern.problem}</p></MobileCompareField>
                <MobileCompareField label="Solución"><p>{pattern.solution}</p></MobileCompareField>
                <MobileCompareField label="Efecto esperado"><p>{pattern.expectedEffect}</p></MobileCompareField>
                <MobileCompareField label="Validación"><ul className="compact-list">{pattern.metrics.map((item) => <li key={item}>{item}</li>)}</ul></MobileCompareField>
                <MobileCompareField label="Limitaciones"><ul className="compact-list">{pattern.limitations.map((item) => <li key={item}>{item}</li>)}</ul></MobileCompareField>
                <MobileCompareField label="Publicaciones">
                  <strong className="big-number">{pattern.evidenceItems.length}</strong>
                  <p className="compare-note">{pattern.evidenceItems.length === 1 ? 'Publicación de origen' : 'Publicaciones de origen'}</p>
                  <a className="text-link" href={`#/pattern/${pattern.id}?section=references`}>Ver referencias →</a>
                </MobileCompareField>
              </article>
            ))}
          </div>

          <div className="comparison-table-wrap">
            <div className="comparison-table" style={{'--cols': selected.length}}>
            <div className="compare-label">Protopatrón</div>
            {selected.map((pattern) => (
              <div className="compare-pattern-head" key={pattern.id}>
                <span>{String(pattern.id).padStart(2,'0')} · {pattern.categoryLabel}</span>
                <h2>{pattern.title}</h2>
                <button type="button" onClick={() => onToggleCompare(pattern.id)}>Quitar ×</button>
              </div>
            ))}

            <CompareRow label="Evidencia">{selected.map((pattern) => <div key={pattern.id}><EvidenceBadge level={pattern.evidence}/><p className="compare-note">{evidenceLabels[pattern.evidence]}</p></div>)}</CompareRow>
            <CompareRow label="Modalidades">{selected.map((pattern) => <div key={pattern.id}><ModalityList modalities={pattern.modalities} compact /></div>)}</CompareRow>
            <CompareRow label="Objetivos">{selected.map((pattern) => <div key={pattern.id}><TagList values={pattern.goals} group="goals" /></div>)}</CompareRow>
            <CompareRow label="Dominios">{selected.map((pattern) => <div key={pattern.id}><TagList values={pattern.domains} group="domains" /></div>)}</CompareRow>
            <CompareRow label="Usuarios">{selected.map((pattern) => <div key={pattern.id}><TagList values={pattern.users} group="users" /></div>)}</CompareRow>
            <CompareRow label="Problema">{selected.map((pattern) => <div key={pattern.id}><p>{pattern.problem}</p></div>)}</CompareRow>
            <CompareRow label="Solución">{selected.map((pattern) => <div key={pattern.id}><p>{pattern.solution}</p></div>)}</CompareRow>
            <CompareRow label="Efecto esperado">{selected.map((pattern) => <div key={pattern.id}><p>{pattern.expectedEffect}</p></div>)}</CompareRow>
            <CompareRow label="Validación">{selected.map((pattern) => <div key={pattern.id}><ul className="compact-list">{pattern.metrics.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</CompareRow>
            <CompareRow label="Limitaciones">{selected.map((pattern) => <div key={pattern.id}><ul className="compact-list">{pattern.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</CompareRow>
            <CompareRow label="Publicaciones">{selected.map((pattern) => <div key={pattern.id}><strong className="big-number">{pattern.evidenceItems.length}</strong><p className="compare-note">{pattern.evidenceItems.length === 1 ? 'publicación de origen' : 'publicaciones de origen'}</p><a className="text-link" href={`#/pattern/${pattern.id}?section=references`}>Ver referencias →</a></div>)}</CompareRow>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function CompareRow({ label, children }) {
  return <><div className="compare-label">{label}</div>{children}</>;
}

function MobileCompareField({ label, children }) {
  return <section className="comparison-mobile-field"><h3>{label}</h3><div>{children}</div></section>;
}
