import React from 'react';
import { patterns } from '../data/patterns';

export default function CompareTray({ compareIds, onRemove, onClear }) {
  if (!compareIds.length) return null;
  const selected = compareIds.map((id) => patterns.find((pattern) => pattern.id === id)).filter(Boolean);
  return (
    <aside className="compare-tray" aria-label="Bandeja de comparación">
      <div className="compare-tray-inner container">
        <div>
          <small>MODO COMPARACIÓN</small>
          <strong>{selected.length}/3 protopatrones seleccionados</strong>
        </div>
        <div className="compare-pills">
          {selected.map((pattern) => (
            <button type="button" key={pattern.id} onClick={() => onRemove(pattern.id)} title="Quitar de la comparación">
              {String(pattern.id).padStart(2, '0')} · {pattern.title} <span>×</span>
            </button>
          ))}
        </div>
        <div className="compare-actions">
          <button className="button ghost small" type="button" onClick={onClear}>Vaciar</button>
          <a className="button primary small" href="#/compare">Comparar ahora</a>
        </div>
      </div>
    </aside>
  );
}
