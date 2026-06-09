import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import Layout from '../components/Layout';
import NotificationList from '../components/NotificationList';
import { fetchNotifications } from '../lib/api';
import { getViewedNotificationIds, markNotificationAsViewed, markAllViewed } from '../lib/viewedNotifications';
import { topNotifications } from '../lib/priority';

const notificationTypes = ['All', 'Placement', 'Result', 'Event'];
const topSizeOptions = [5, 10, 15, 20];

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [topSize, setTopSize] = useState(10);
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
        const data = await fetchNotifications({ limit: 80, page: 1, notificationType: type });
        setNotifications(data);
      } catch (err) {
        setError(err.message ?? 'Unable to load notifications');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type]);

  const topList = useMemo(() => topNotifications(notifications, topSize), [notifications, topSize]);

  const handleView = (notification) => {
    const id = String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || '');
    if (!id) return;
    markNotificationAsViewed(id);
    setViewedIds(getViewedNotificationIds());
  };

  const handleMarkAll = () => {
    const ids = topList.map((notification) => String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || ''));
    markAllViewed(ids);
    setViewedIds(getViewedNotificationIds());
  };

  return (
    <Layout title="Priority Inbox">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography color="text.secondary">Only the current top notifications are shown here.</Typography>
        <Button variant="contained" onClick={handleMarkAll} disabled={!topList.length}>
          Mark top list as read
        </Button>
      </Stack>

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="priority-type-label">Notification Type</InputLabel>
            <Select labelId="priority-type-label" label="Notification Type" value={type} onChange={(event) => setType(event.target.value)}>
              {notificationTypes.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="top-n-label">Top N</InputLabel>
            <Select labelId="top-n-label" label="Top N" value={topSize} onChange={(event) => setTopSize(event.target.value)}>
              {topSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography color="text.secondary">Showing top {topSize} notifications by priority.</Typography>
        </Stack>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList notifications={topList} viewedIds={viewedIds} onView={handleView} />
      )}
    </Layout>
  );
}
