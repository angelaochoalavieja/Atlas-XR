import { optionLabels } from './data/patterns';

export function readHashRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [route = '', query = ''] = raw.split('?');
  return { route, query: new URLSearchParams(query) };
}

export function labelFor(group, key) {
  return optionLabels[group]?.[key] || key;
}

export function categoryClass(category = '') {
  return `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function evidenceStrength(level) {
  return level === 'I' ? 3 : level === 'II' ? 2 : 1;
}

export function matchesFreeText(pattern, search) {
  if (!search.trim()) return true;
  const haystack = [
    pattern.title,
    pattern.originalTitle,
    pattern.subtitle,
    pattern.category,
    pattern.categoryLabel,
    pattern.problem,
    pattern.solution,
    pattern.expectedEffect,
    pattern.evidenceRationale,
    ...pattern.limitations,
    ...pattern.metrics,
    ...pattern.evidenceItems.flatMap((item) => [item.study, item.citation, item.method, item.finding, item.caveat]),
    ...pattern.goals.map((key) => optionLabels.goals[key]),
    ...pattern.modalities.map((key) => optionLabels.modalities[key]),
    ...pattern.domains.map((key) => optionLabels.domains[key]),
    ...pattern.users.map((key) => optionLabels.users[key]),
  ].filter(Boolean).join(' ').toLowerCase();
  return search.toLowerCase().trim().split(/\s+/).every((token) => haystack.includes(token));
}

export function facetMatch(patternValues, selectedValues) {
  if (!selectedValues.length) return true;
  return selectedValues.some((value) => patternValues.includes(value));
}

export function toggleArrayValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function computeGuidedMatch(pattern, criteria) {
  const reasons = [];
  const misses = [];
  let score = 0;
  let possible = 0;

  if (criteria.goal) {
    possible += 5;
    if (pattern.goals.includes(criteria.goal)) {
      score += 5;
      reasons.push(`Coincide con el objetivo principal: ${optionLabels.goals[criteria.goal]}`);
    } else {
      misses.push('El objetivo principal de diseño no coincide de forma directa');
    }
  }

  if (criteria.user) {
    possible += 3;
    if (pattern.users.includes(criteria.user)) {
      score += 3;
      reasons.push(`Incluye el grupo de usuarios seleccionado: ${optionLabels.users[criteria.user]}`);
    } else {
      misses.push('La evidencia sobre usuarios no es específica para el grupo seleccionado');
    }
  }

  if (criteria.modalities.length) {
    possible += criteria.modalities.length * 2;
    const matched = criteria.modalities.filter((modality) => pattern.modalities.includes(modality));
    score += matched.length * 2;
    if (matched.length) reasons.push(`Utiliza ${matched.map((key) => optionLabels.modalities[key]).join(', ')}`);
    if (matched.length < criteria.modalities.length) {
      const missing = criteria.modalities.filter((modality) => !pattern.modalities.includes(modality));
      misses.push(`No utiliza ${missing.map((key) => optionLabels.modalities[key]).join(', ')}`);
    }
  }

  if (criteria.domain) {
    possible += 2;
    if (pattern.domains.includes(criteria.domain)) {
      score += 2;
      reasons.push(`Se ha estudiado en ${optionLabels.domains[criteria.domain]}`);
    } else {
      misses.push('El dominio de aplicación difiere del contexto seleccionado');
    }
  }


  return {
    score,
    possible,
    percent: possible ? Math.round((score / possible) * 100) : 0,
    reasons,
    misses,
  };
}
