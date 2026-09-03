import React, { useEffect } from 'react';
import { evidenceDefinitions, getPatternById, getReferenceList, getRelatedPatterns } from '../data/patterns';
import { CheckIcon, EvidenceBadge, InfoCallout, ModalityList, PatternNumber, TagList } from '../components/UI';
import { categoryClass } from '../utils';

export default function PatternDetail({ id, query, compareIds, onToggleCompare }) {
  const pattern = getPatternById(id);
  const requestedSection = query?.get('section') || '';

  useEffect(() => {
    if (!requestedSection) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(requestedSection)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [id, requestedSection]);

  if (!pattern) {
    return <main id="main-content" className="container page"><h1>Protopatrón no encontrado</h1><a className="text-link" href="#/explore">Volver al catálogo</a></main>;
  }

  const related = getRelatedPatterns(pattern, 4);
  const refs = getReferenceList(pattern);
  const isCompared = compareIds.includes(pattern.id);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main id="main-content" className={`pattern-detail premium-detail ${categoryClass(pattern.category)}`}>
      <div className="container detail-breadcrumb"><a href="#/">Inicio</a><span>›</span><a href="#/explore">Catálogo</a><span>›</span><span>Protopatrón {String(pattern.id).padStart(2, '0')}</span></div>

      <header className="container premium-detail-hero">
        <div className="detail-title-block">
          <div className="detail-kicker-row">
            <PatternNumber pattern={pattern} />
            <span>{pattern.categoryLabel}</span>
            <span className="dot-separator" aria-hidden="true">·</span>
            <span>{pattern.refIds.length} {pattern.refIds.length === 1 ? 'Fuente' : 'Fuentes'} de origen</span>
          </div>
          <h1>{pattern.title}</h1>
          <p className="detail-subtitle">{pattern.subtitle}</p>
        </div>

        <aside className="detail-evidence-card">
          <EvidenceBadge level={pattern.evidence} />
          <p>{evidenceDefinitions[pattern.evidence]}</p>
          <button
            type="button"
            className={`button ${isCompared ? 'secondary selected' : 'primary'}`}
            onClick={() => onToggleCompare(pattern.id)}
          >
            {isCompared ? 'Quitar de comparación' : 'Añadir a comparación'}
          </button>
        </aside>
      </header>

      <section className="container detail-at-glance" aria-labelledby="logic-title">
        <div className="section-head minimal">
          <div><p className="kicker">LÓGICA DE DISEÑO</p><h2 id="logic-title">De la necesidad a la respuesta de diseño</h2></div>
        </div>
        <div className="logic-stack">
          <article><span>01</span><div><small>PROBLEMA</small><p>{pattern.problem}</p></div></article>
          <article><span>02</span><div><small>SOLUCIÓN DE DISEÑO</small><p>{pattern.solution}</p></div></article>
          <article className="logic-outcome"><span>03</span><div><small>EFECTO ESPERADO</small><p>{pattern.expectedEffect}</p></div></article>
        </div>
      </section>

      <div className="container premium-detail-layout">
        <aside className="detail-side-rail">
          <nav className="detail-toc" aria-label="Secciones del protopatrón">
            <small>EN ESTA FICHA</small>
            <button type="button" onClick={() => scrollToSection('context')}>Contexto y alcance</button>
            <button type="button" onClick={() => scrollToSection('tradeoffs')}>Limitaciones</button>
            <button type="button" onClick={() => scrollToSection('validation')}>Validación</button>
            <button type="button" onClick={() => scrollToSection('evidence-trail')}>Evidencia de origen</button>
            <button type="button" onClick={() => scrollToSection('references')}>Referencias</button>
          </nav>

          <div className="detail-facts">
            <div><small>Objetivos</small><TagList values={pattern.goals} group="goals" /></div>
            <div><small>Dominios</small><TagList values={pattern.domains} group="domains" /></div>
            <div><small>Usuarios</small><TagList values={pattern.users} group="users" /></div>
            <div><small>Modalidades</small><ModalityList modalities={pattern.modalities} /></div>
          </div>
        </aside>

        <article className="detail-article">
          <section id="context" className="detail-section premium-section">
            <p className="section-number">01</p>
            <div className="detail-section-copy">
              <p className="kicker">CONTEXTO Y ALCANCE</p>
              <h2>Dónde se ha estudiado y para quién resulta relevante.</h2>
              <div className="context-fact-grid">
                <MetaBlock title="Objetivos de diseño" values={pattern.goals} group="goals" />
                <MetaBlock title="Dominios de aplicación" values={pattern.domains} group="domains" />
                <MetaBlock title="Usuarios objetivo" values={pattern.users} group="users" />
                <div className="meta-block"><small>Modalidades implicadas</small><ModalityList modalities={pattern.modalities} /></div>
              </div>
            </div>
          </section>

          <section id="tradeoffs" className="detail-section premium-section">
            <p className="section-number">02</p>
            <div className="detail-section-copy">
              <p className="kicker">ANTES DE APLICARLO</p>
              <h2>Limitaciones y compromisos de diseño.</h2>
              <div className="premium-tradeoff-list">
                {pattern.limitations.map((item, index) => (
                  <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></article>
                ))}
              </div>
            </div>
          </section>

          <section id="validation" className="detail-section premium-section">
            <p className="section-number">03</p>
            <div className="detail-section-copy">
              <p className="kicker">VALIDACIÓN</p>
              <h2>Qué podría medir una nueva implementación.</h2>
              <p className="section-intro">El kit reúne medidas utilizadas en la literatura y otras adecuadas para comprobar la lógica del protopatrón. No implica que todas las métricas hayan sido usadas por todos los estudios citados.</p>
              <ol className="validation-list">
                {pattern.metrics.map((metric) => <li key={metric}>{metric}</li>)}
              </ol>
            </div>
          </section>

          <section id="evidence-trail" className="detail-section premium-section evidence-trail-section">
            <p className="section-number">04</p>
            <div className="detail-section-copy">
              <div className="evidence-section-head">
                <div>
                  <p className="kicker">EVIDENCIA DE ORIGEN</p>
                  <h2>Resultados observados en la literatura</h2>
                  <p className="evidence-source-count">{pattern.evidenceItems.length} {pattern.evidenceItems.length === 1 ? 'Publicación de origen' : 'Publicaciones de origen'}</p>
                </div>
                <EvidenceBadge level={pattern.evidence} />
              </div>

              <div className="premium-study-stack">
                {pattern.evidenceItems.map((item, index) => (
                  <article className="premium-study" key={`${item.study}-${index}`}>
                    <div className="study-topline"><span>E{String(index + 1).padStart(2, '0')}</span><b>{item.citation}</b><small>{item.method}</small></div>
                    <h3>{item.study}</h3>
                    <div className="study-evidence-grid">
                      <div><small>RESULTADO OBSERVADO</small><p>{item.finding}</p></div>
                      <div><small>LÍMITE DE INTERPRETACIÓN</small><p>{item.caveat}</p></div>
                    </div>
                  </article>
                ))}
              </div>

              <InfoCallout title={`Por qué N.E.E. ${pattern.evidence}`} tone="neutral">
                <p>{pattern.evidenceRationale || evidenceDefinitions[pattern.evidence]}</p>
                <p>El nivel se aplica al protopatrón en conjunto; no es una puntuación de calidad de cada publicación ni una jerarquía clínica de evidencia.</p>
              </InfoCallout>
            </div>
          </section>

          <section id="references" className="detail-section premium-section references-section">
            <p className="section-number">05</p>
            <div className="detail-section-copy">
              <p className="kicker">REFERENCIAS</p>
              <h2>Trazabilidad bibliográfica.</h2>
              <p className="section-intro">Las tarjetas de evidencia utilizan citas breves para mantener la lectura fluida. Aquí se conserva la referencia completa con todos los autores de cada trabajo.</p>
              <ol className="premium-reference-list">{refs.map((reference) => <li key={reference}>{linkifyReference(reference)}</li>)}</ol>
            </div>
          </section>
        </article>
      </div>

      <section className="related-section premium-related">
        <div className="container">
          <div className="section-head minimal">
            <div><p className="kicker">CONTINUAR EXPLORANDO</p><h2>Protopatrones relacionados</h2></div>
            <p>Relación calculada a partir de objetivos, modalidades, dominios y grupos de usuarios compartidos.</p>
          </div>
          <div className="related-list">
            {related.map((item) => (
              <a key={item.pattern.id} href={`#/pattern/${item.pattern.id}`} className={`related-row ${categoryClass(item.pattern.category)}`}>
                <PatternNumber pattern={item.pattern} />
                <div><strong>{item.pattern.title}</strong><small>{item.pattern.categoryLabel}</small></div>
                <div className="related-reasons">
                  {item.sharedGoals.length > 0 && <span><CheckIcon /> Objetivo</span>}
                  {item.sharedModalities.length > 0 && <span><CheckIcon /> {item.sharedModalities.length} {item.sharedModalities.length === 1 ? 'Modalidad' : 'Modalidades'}</span>}
                  {item.sharedDomains.length > 0 && <span><CheckIcon /> Dominio</span>}
                </div>
                <EvidenceBadge level={item.pattern.evidence} compact />
                <span className="related-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function MetaBlock({ title, values, group }) {
  return <div className="meta-block"><small>{title}</small><TagList values={values} group={group}/></div>;
}

function linkifyReference(reference) {
  const urlMatch = reference.match(/https?:\/\/\S+/);
  if (!urlMatch) return <div className="reference-content"><span className="reference-citation">{reference}</span></div>;
  const rawUrl = urlMatch[0];
  const url = rawUrl.replace(/[.,;]+$/, '');
  const before = reference.slice(0, urlMatch.index).trim();
  const after = reference.slice(urlMatch.index + rawUrl.length).trim();
  return (
    <div className="reference-content">
      <span className="reference-citation">{before}{after ? ` ${after}` : ''}</span>
      <a className="reference-source-link" href={url} target="_blank" rel="noreferrer">Abrir publicación <span aria-hidden="true">↗</span></a>
    </div>
  );
}
