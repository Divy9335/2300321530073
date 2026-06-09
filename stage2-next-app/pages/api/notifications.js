const API_BASE = 'http://4.224.186.213/evaluation-service/notifications';

function getAuthHeaders() {
  const token = process.env.API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default async function handler(req, res) {
  const { limit = '20', page = '1', notification_type } = req.query;
  const params = new URLSearchParams();
  params.set('limit', limit);
  params.set('page', page);
  if (notification_type) {
    params.set('notification_type', notification_type);
  }

  const url = `${API_BASE}?${params.toString()}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    const body = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    res.status(response.status).setHeader('Content-Type', contentType).send(body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
