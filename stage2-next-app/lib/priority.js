const TYPE_WEIGHTS = {
  Placement: 1000,
  Result: 700,
  Event: 400
};

function normalizeType(value) {
  if (!value) return 'Unknown';
  return String(value).trim().charAt(0).toUpperCase() + String(value).trim().slice(1).toLowerCase();
}

export function scoreNotification(notification) {
  const type = normalizeType(notification.notification_type || notification.type || notification.typeName || 'Unknown');
  const weight = TYPE_WEIGHTS[type] || 100;
  const timestamp = notification.createdAt || notification.publishedAt || notification.timestamp || notification.date || '';
  const eventDate = timestamp ? new Date(timestamp) : new Date();
  const ageHours = Math.max(0, (Date.now() - eventDate.getTime()) / 1000 / 3600);
  const recency = Math.max(0, 120 - ageHours);
  return weight * 1000 + recency;
}

export function topNotifications(notifications, limit) {
  const scored = notifications.map((notification) => ({
    ...notification,
    score: scoreNotification(notification)
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
