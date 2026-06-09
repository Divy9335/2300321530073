const STORAGE_KEY = 'affordmed_viewed_notifications';

export function getViewedNotificationIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

export function markNotificationAsViewed(id) {
  if (typeof window === 'undefined') return;
  const current = getViewedNotificationIds();
  current.add(String(id));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
}

export function markAllViewed(ids = []) {
  if (typeof window === 'undefined') return;
  const current = new Set(getViewedNotificationIds());
  ids.forEach((id) => current.add(String(id)));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
}
