const API_BASE = 'http://4.224.186.213/evaluation-service/notifications';

function getAuthHeaders() {
  const token = process.env.NEXT_PUBLIC_NOTIF_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchNotifications({ limit = 20, page = 1, notificationType } = {}) {
  const params = new URLSearchParams();
  params.set('limit', limit);
  params.set('page', page);
  if (notificationType && notificationType !== 'All') {
    params.set('notification_type', notificationType);
  }
  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
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
