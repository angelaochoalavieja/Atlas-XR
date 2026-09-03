import React from 'react';
import { categoryClass } from '../utils';
import { ArrowIcon, EvidenceBadge, PatternNumber, SensorySignature, TagList } from './UI';

export default function PatternCard({ pattern, compareSelected = false, onToggleCompare, compact = false }) {
  return (
    <article className={`pattern-card ${categoryClass(pattern.category)} ${compact ? 'compact' : ''}`}>
      <div className="card-topline">
        <div className="card-identity">
          <PatternNumber pattern={pattern} />
          <span>{pattern.categoryLabel || pattern.category}</span>
        </div>
        <EvidenceBadge level={pattern.evidence} compact />
      </div>

      <div className="card-copy">
        <h3><a href={`#/pattern/${pattern.id}`}>{pattern.title}</a></h3>
        <p>{pattern.subtitle}</p>
      </div>

      {!compact && (
        <div className="card-metadata">
          <TagList values={pattern.goals} group="goals" limit={2} />
          <SensorySignature modalities={pattern.modalities} small />
        </div>
      )}

      <div className="card-footer">
        <a className="text-link" href={`#/pattern/${pattern.id}`}>Abrir ficha <ArrowIcon /></a>
        {onToggleCompare && (
          <button
            type="button"
            className={`compare-button ${compareSelected ? 'selected' : ''}`}
            onClick={() => onToggleCompare(pattern.id)}
            aria-pressed={compareSelected}
          >
            {compareSelected ? 'Quitar de comparación' : 'Comparar'}
          </button>
        )}
      </div>
    </article>
  );
}
