export async function fetchNotifications({ limit = 20, page = 1, notificationType } = {}) {
  const params = new URLSearchParams();
  params.set('limit', limit);
  params.set('page', page);
  if (notificationType && notificationType !== 'All') {
    params.set('notification_type', notificationType);
  }
  const response = await fetch(`/api/notifications?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || `API returned ${response.status}`);
  }
  if (!Array.isArray(body)) {
    throw new Error('Unexpected API response format');
  }
  return body;
}
