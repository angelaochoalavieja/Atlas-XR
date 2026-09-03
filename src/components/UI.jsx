import React from 'react';
import { evidenceDefinitions, evidenceLabels, modalityShortLabels, optionLabels } from '../data/patterns';
import { categoryClass } from '../utils';

export function EvidenceBadge({ level, compact = false }) {
  return (
    <span className={`evidence-badge evidence-${level.toLowerCase()}`} title={evidenceDefinitions[level]}>
      <span className="evidence-bars" aria-hidden="true">
        {[1, 2, 3].map((bar) => <i key={bar} className={bar <= (level === 'I' ? 3 : level === 'II' ? 2 : 1) ? 'on' : ''} />)}
      </span>
      <span>{compact ? `N.E.E. ${level}` : `N.E.E. ${level} · ${evidenceLabels[level]}`}</span>
    </span>
  );
}

export function SensorySignature({ modalities, labels = false, small = false }) {
  return (
    <div className={`sensory-signature ${small ? 'small' : ''}`} aria-label={`Modalidades: ${modalities.map((key) => optionLabels.modalities[key]).join(', ')}`}>
      {Object.keys(optionLabels.modalities).map((key) => (
        <span
          key={key}
          className={`sensory-cell modality-${key} ${modalities.includes(key) ? 'active' : ''}`}
          title={optionLabels.modalities[key]}
        >
          <b>{modalityShortLabels[key]}</b>
          {labels && <small>{optionLabels.modalities[key].split(' ')[0]}</small>}
        </span>
      ))}
    </div>
  );
}


export function ModalityList({ modalities, compact = false }) {
  return (
    <div className={`modality-list ${compact ? 'compact' : ''}`} aria-label={`Modalidades: ${modalities.map((key) => optionLabels.modalities[key]).join(', ')}`}>
      {modalities.map((key) => (
        <span className={`modality-chip modality-${key}`} key={key}>
          <i aria-hidden="true" />
          {optionLabels.modalities[key]}
        </span>
      ))}
    </div>
  );
}

export function TagList({ values, group, limit }) {
  const visible = limit ? values.slice(0, limit) : values;
  return (
    <div className="tag-row">
      {visible.map((value) => <span className="tag" key={value}>{optionLabels[group]?.[value] || value}</span>)}
      {limit && values.length > limit && <span className="tag tag-more">+{values.length - limit}</span>}
    </div>
  );
}

export function PatternNumber({ pattern }) {
  return <span className={`pattern-number ${categoryClass(pattern.category)}`}>{String(pattern.id).padStart(2, '0')}</span>;
}

export function SectionLabel({ children }) {
  return <p className="eyebrow">{children}</p>;
}

export function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="m12.5 12.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}

export function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4 10 3.2 3.2L16 5.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function InfoCallout({ title, children, tone = 'neutral' }) {
  return <aside className={`info-callout tone-${tone}`}><strong>{title}</strong><div>{children}</div></aside>;
}
