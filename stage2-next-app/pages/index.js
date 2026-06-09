import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import Layout from '../components/Layout';
import NotificationList from '../components/NotificationList';
import { fetchNotifications } from '../lib/api';
import { getViewedNotificationIds, markNotificationAsViewed, markAllViewed } from '../lib/viewedNotifications';

const notificationTypes = ['All', 'Placement', 'Result', 'Event'];
const pageSizes = [10, 20, 40];

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [type, setType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewedIds, setViewedIds] = useState(new Set());

  useEffect(() => {
    setViewedIds(getViewedNotificationIds());
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchNotifications({ limit, page, notificationType: type });
        setNotifications(data);
      } catch (err) {
        setError(err.message ?? 'Unable to load notifications');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit, page, type]);

  const newCount = useMemo(() => {
    return notifications.filter((notification) => {
      const id = String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || '');
      return id && !viewedIds.has(id);
    }).length;
  }, [notifications, viewedIds]);

  const handleView = (notification) => {
    const id = String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || '');
    if (!id) return;
    markNotificationAsViewed(id);
    setViewedIds(getViewedNotificationIds());
  };

  const handleMarkAll = () => {
    const ids = notifications.map((notification) => String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || '')); 
    markAllViewed(ids);
    setViewedIds(getViewedNotificationIds());
  };

  return (
    <Layout title="All Notifications">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip label={`New: ${newCount}`} color="secondary" />
          <Typography color="text.secondary">Page</Typography>
          <Pagination color="primary" page={page} count={5} onChange={(_, value) => setPage(value)} />
        </Stack>
        <Button variant="contained" onClick={handleMarkAll} disabled={!notifications.length}>
          Mark visible as read
        </Button>
      </Stack>

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="filter-type-label">Notification Type</InputLabel>
            <Select labelId="filter-type-label" label="Notification Type" value={type} onChange={(event) => setType(event.target.value)}>
              {notificationTypes.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="page-size-label">Page Size</InputLabel>
            <Select labelId="page-size-label" label="Page Size" value={limit} onChange={(event) => setLimit(event.target.value)}>
              {pageSizes.map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList notifications={notifications} viewedIds={viewedIds} onView={handleView} />
      )}
    </Layout>
  );
}
