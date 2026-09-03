import React from 'react';
import { optionLabels } from '../data/patterns';
import { categoryClass } from '../utils';
import { EvidenceBadge, PatternNumber, SensorySignature } from './UI';

export default function PatternLandscape({ items, compact = false }) {
  return (
    <div className={`landscape ${compact ? 'compact' : ''}`}>
      <div className="landscape-head">
        <span>Protopatrón</span>
        {!compact && <span>Objetivo principal</span>}
        <span>Modalidades</span>
        <span>Evidencia</span>
      </div>
      {items.map((pattern) => (
        <a className={`landscape-row ${categoryClass(pattern.category)}`} href={`#/pattern/${pattern.id}`} key={pattern.id}>
          <span className="landscape-title"><PatternNumber pattern={pattern}/><b>{compact ? pattern.title.split(' ').slice(0, 5).join(' ') : pattern.title}</b></span>
          {!compact && <span className="landscape-goal">{optionLabels.goals[pattern.goals[0]]}</span>}
          <SensorySignature modalities={pattern.modalities} small />
          <EvidenceBadge level={pattern.evidence} compact />
        </a>
      ))}
    </div>
  );
}
