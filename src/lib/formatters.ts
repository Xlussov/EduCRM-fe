export const formatPercent = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '0';
  }
  return Number(value).toFixed(2).replace(/\.00$/, '');
};

export const formatDate = (isoString: string): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString();
};

export const formatTime = (isoString: string): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};