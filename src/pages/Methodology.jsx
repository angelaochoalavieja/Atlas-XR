import React, { useEffect } from 'react';
import PatternLandscape from '../components/PatternLandscape';
import { allReferenceIds, evidenceDefinitions, evidenceLabels, optionLabels, patterns } from '../data/patterns';
import { EvidenceBadge, InfoCallout } from '../components/UI';

const sections = [
  ['method-flow', '01', 'Flujo del proyecto'],
  ['method-definition', '02', 'Qué es un protopatrón'],
  ['method-anatomy', '03', 'Estructura de las fichas'],
  ['method-evidence', '04', 'Nivel de evidencia'],
  ['method-writing', '05', 'Reglas de evidencia'],
  ['method-navigation', '06', 'Búsqueda y navegación'],
  ['method-corpus', '07', 'Estado del corpus'],
  ['method-limits', '08', 'Limitaciones'],
  ['method-glossary', '09', 'Glosario'],
];

export default function Methodology({ query }) {
  const evidenceCounts = Object.keys(evidenceLabels).map((level) => ({ level, count: patterns.filter((pattern) => pattern.evidence === level).length }));

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const section = query?.get('section');
    if (!section) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [query]);

  return (
    <main id="main-content" className="container page methodology-page premium-methodology">
      <header className="page-heading-simple methodology-heading">
        <div><p className="kicker">METODOLOGÍA</p><h1>Cómo se construye y se consulta el catálogo</h1></div>
        <p>Esta página documenta la estructura de extracción, la interpretación del N.E.E. y las estrategias de recuperación implementadas en la web. La lógica de búsqueda es explícita para que pueda discutirse y validarse.</p>
      </header>

      <div className="method-layout">
        <aside className="method-sidebar">
          <small>CONTENIDO</small>
          <nav aria-label="Secciones de metodología">
            {sections.map(([id, number, label]) => <button type="button" key={id} onClick={() => scrollTo(id)}><span>{number}</span>{label}</button>)}
          </nav>
          <div className="method-corpus-mini">
            <span><b>{patterns.length}</b> protopatrones</span>
            <span><b>{allReferenceIds.length}</b> publicaciones</span>
          </div>
        </aside>

        <article className="method-article">
          <MethodSection id="method-flow" number="01" kicker="FLUJO DEL PROYECTO" title="De la literatura a un catálogo navegable">
            <p>El TFM parte del estudio sistemático de la literatura, identifica casos de uso relevantes, normaliza un formato de protopatrón y documenta el resultado en una web con distintas estrategias de navegación. La validación con expertos constituye la fase posterior.</p>
            <div className="research-flow premium-flow">
              {[
                ['01','Literatura','Revisión del corpus seleccionado.'],
                ['02','Casos de uso','Identificación de soluciones XR relevantes.'],
                ['03','Protopatrones','Normalización de problema, solución, contexto y evidencia.'],
                ['04','Web','Búsqueda, comparación y navegación del catálogo.'],
                ['05','Expertos','Evaluación posterior de claridad, utilidad y aplicabilidad.'],
              ].map(([n,title,copy]) => <article key={n}><span>{n}</span><div><b>{title}</b><p>{copy}</p></div></article>)}
            </div>
          </MethodSection>

          <MethodSection id="method-definition" number="02" kicker="DEFINICIÓN" title="Qué se considera un protopatrón">
            <blockquote className="method-definition">Una solución de diseño que aparece de forma recurrente en la literatura revisada y que puede orientar el diseño de sistemas que afrontan un problema de interacción similar.</blockquote>
            <p>La unidad principal del catálogo es la relación <strong>problema de diseño → solución → efecto esperado</strong>. El prefijo <em>proto-</em> es deliberado: son patrones iniciales derivados del corpus revisado, no estándares maduros ni reglas universales.</p>
          </MethodSection>

          <MethodSection id="method-anatomy" number="03" kicker="ANATOMÍA" title="La misma estructura en todas las fichas">
            <div className="method-anatomy-grid">
              {[
                ['Problema','Necesidad o limitación de interacción.'],
                ['Contexto','Dominios y usuarios documentados.'],
                ['Solución','Respuesta de diseño recurrente.'],
                ['Efecto esperado','Resultado que la solución pretende favorecer.'],
                ['Limitaciones','Compromisos, confusores y límites de generalización.'],
                ['Validación','Métricas útiles para una futura implementación.'],
                ['Evidencia','Método, resultado observado y cautela por estudio.'],
                ['Referencias','Trazabilidad bibliográfica completa.'],
              ].map(([title,copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
            </div>
          </MethodSection>

          <MethodSection id="method-evidence" number="04" kicker="NIVEL DE EVIDENCIA EMPÍRICA" title="Un indicador de respaldo dentro del corpus">
            <div className="method-nee-grid">
              {['I','II','III'].map((level) => (
                <article key={level}><EvidenceBadge level={level}/><strong>{evidenceLabels[level]}</strong><p>{evidenceDefinitions[level]}</p><small>{patterns.filter((pattern) => pattern.evidence === level).length} {patterns.filter((pattern) => pattern.evidence === level).length === 1 ? 'protopatrón' : 'protopatrones'}</small></article>
              ))}
            </div>
            <InfoCallout title="Límite de interpretación" tone="neutral"><p>El N.E.E. se aplica al protopatrón en conjunto. No puntúa la calidad metodológica individual de cada artículo y no es una jerarquía clínica de evidencia.</p></InfoCallout>
          </MethodSection>

          <MethodSection id="method-writing" number="05" kicker="REGLAS DE EVIDENCIA" title="Separar lo observado de lo recomendado">
            <div className="method-rule-list">
              <Rule letter="A" title="Resultados ligados a la fuente">La sección de evidencia solo atribuye a un estudio aquello que ese trabajo reporta.</Rule>
              <Rule letter="B" title="Métricas en una capa distinta">El kit de validación puede reunir medidas usadas en la literatura y otras adecuadas para futuras implementaciones.</Rule>
              <Rule letter="C" title="Confusores multisensoriales explícitos">Si varios estímulos cambian a la vez, el efecto se atribuye a la condición combinada salvo que el diseño permita separarlos.</Rule>
              <Rule letter="D" title="Evidencia exploratoria sin generalización">Casos únicos, pilotos y prototipos aportan orientación de diseño, pero no se presentan como demostraciones causales generales.</Rule>
              <Rule letter="E" title="Cita breve, referencia completa">La evidencia usa citas breves para facilitar la lectura; la sección Referencias conserva la autoría completa del trabajo.</Rule>
            </div>
          </MethodSection>

          <MethodSection id="method-navigation" number="06" kicker="BÚSQUEDA Y NAVEGACIÓN" title="Cinco formas de recuperar el mismo conocimiento">
            <div className="navigation-strategy-list">
              <Strategy number="01" title="Exploración directa" copy="Recorrido del catálogo y apertura de fichas individuales." label="ESTRUCTURA" />
              <Strategy number="02" title="Texto libre + facetas" copy="Busca en títulos, problemas, soluciones, métricas y estudios; después filtra por objetivo, modalidad, dominio, usuarios y evidencia." label="CONSULTA" />
              <Strategy number="03" title="Búsqueda guiada" copy="Ordena los protopatrones según la coincidencia con criterios de diseño seleccionados por el usuario." label="PROBLEMA" />
              <Strategy number="04" title="Navegación asociativa" copy="Conecta protopatrones mediante objetivos, modalidades, dominios y usuarios compartidos." label="RELACIONES" />
              <Strategy number="05" title="Comparación" copy="Contrasta hasta tres fichas en paralelo sin convertir la evidencia en un ranking de ganadores." label="CONTRASTE" />
            </div>

            <div className="retrieval-logic-grid premium-retrieval">
              <article><h3>Facetas</h3><p><strong>OR dentro de una faceta:</strong> Háptica + Auditiva devuelve patrones que usan cualquiera de esos canales.</p><p><strong>AND entre facetas:</strong> si además se activa Accesibilidad, el resultado debe coincidir también con ese objetivo.</p></article>
              <article><h3>Búsqueda guiada</h3><p>El objetivo de diseño tiene la mayor importancia. Después se usan usuarios, modalidades y dominio para afinar el orden de los resultados.</p><p>El N.E.E. se muestra aparte como información sobre el respaldo empírico y no modifica la coincidencia.</p></article>
              <article><h3>Relacionados</h3><p>Se muestran primero los protopatrones que comparten objetivos de diseño y, después, los que coinciden en modalidades, dominios o usuarios.</p><p>La relación se calcula sobre metadatos estructurados, no mediante similitud generativa.</p></article>
            </div>
          </MethodSection>

          <MethodSection id="method-corpus" number="07" kicker="CORPUS ACTUAL" title="Qué contiene la web">
            <div className="method-stat-row">
              <div><strong>{patterns.length}</strong><span>Protopatrones</span></div>
              <div><strong>{allReferenceIds.length}</strong><span>Publicaciones citadas</span></div>
              <div><strong>{Object.keys(optionLabels.modalities).length}</strong><span>Modalidades</span></div>
              <div><strong>{Object.keys(optionLabels.goals).length}</strong><span>Objetivos</span></div>
            </div>
            <div className="method-evidence-bars">
              {evidenceCounts.map(({ level, count }) => <div key={level}><span>N.E.E. {level} · {evidenceLabels[level]}</span><i><b style={{ width: `${(count / patterns.length) * 100}%` }} /></i><strong>{count}</strong></div>)}
            </div>
            <PatternLandscape items={patterns} />
          </MethodSection>

          <MethodSection id="method-limits" number="08" kicker="LIMITACIONES" title="Qué no debería afirmarse a partir del atlas">
            <ol className="method-limit-list">
              <li>El catálogo está limitado por el corpus revisado; una ausencia no demuestra ausencia de literatura externa.</li>
              <li>Las etiquetas normalizadas simplifican contextos heterogéneos y no sustituyen la lectura de la ficha detallada.</li>
              <li>La búsqueda guiada ordena coincidencias de metadatos; el N.E.E. se muestra como información independiente y no modifica la relevancia de los resultados. La coincidencia no estima tamaño del efecto ni probabilidad de éxito.</li>
              <li>Compartir objetivos o modalidades no implica que dos protopatrones sean intercambiables.</li>
              <li>La validación con expertos puede motivar cambios en etiquetas, navegación, redacción y estructura.</li>
            </ol>
          </MethodSection>

          <MethodSection id="method-glossary" number="09" kicker="GLOSARIO" title="Términos utilizados en el atlas">
            <dl className="premium-glossary">
              <Glossary term="XR">Realidad extendida: término general que engloba tecnologías como VR y AR.</Glossary>
              <Glossary term="VR">Realidad virtual: entorno digital que sustituye visualmente al entorno físico.</Glossary>
              <Glossary term="AR">Realidad aumentada: contenido digital superpuesto sobre el entorno físico.</Glossary>
              <Glossary term="Háptico">Relacionado con el tacto, incluida vibración, resistencia y retroalimentación de fuerza.</Glossary>
              <Glossary term="Multisensorial">Experiencia que utiliza más de un canal sensorial.</Glossary>
              <Glossary term="Presencia">Sensación subjetiva de estar dentro del entorno virtual.</Glossary>
              <Glossary term="Protopatrón">Solución de diseño recurrente extraída de la literatura revisada.</Glossary>
              <Glossary term="N.E.E.">Nivel de Evidencia Empírica utilizado para comunicar respaldo experimental dentro del corpus.</Glossary>
            </dl>
          </MethodSection>
        </article>
      </div>
    </main>
  );
}

function MethodSection({ id, number, kicker, title, children }) {
  return <section id={id} className="method-section"><div className="method-section-number">{number}</div><div><p className="kicker">{kicker}</p><h2>{title}</h2><div className="method-section-body">{children}</div></div></section>;
}
function Rule({ letter, title, children }) { return <article><span>{letter}</span><div><h3>{title}</h3><p>{children}</p></div></article>; }
function Strategy({ number, title, copy, label }) { return <article><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><small>{label}</small></article>; }
function Glossary({ term, children }) { return <div><dt>{term}</dt><dd>{children}</dd></div>; }
