export function debounce(fn: () => void, delay = 300) {
  let timeout: number;
  return () => {
    clearTimeout(timeout);
    timeout = window.setTimeout(fn, delay);
  };
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatDisplayName(name: string): string {
  return name.replace(/[-_]/g, ' ').split(' ').map(capitalize).join(' ');
}

export function getTitleFromKey(key: string): string {
  const base = key.split('_').slice(1).join('_');
  return capitalize(base.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
}

export function getGroupFromKey(key: string): string {
  const underscoreIndex = key.indexOf('_');
  if (underscoreIndex === -1) return 'Ungrouped';

  const parts = key.split('_');
  if (parts.length <= 1) return formatDisplayName(parts[0]);

  const groupParts = parts.slice(0, -1);
  const formattedParts = groupParts.map(formatDisplayName);

  return formattedParts.join(' → ');
}
