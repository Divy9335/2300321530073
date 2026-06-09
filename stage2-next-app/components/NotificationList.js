import { Box, Typography } from '@mui/material';
import NotificationCard from './NotificationCard';

export default function NotificationList({ notifications, viewedIds, onView }) {
  if (!notifications.length) {
    return (
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No notifications found for the current filter.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => {
        const id = String(notification.id || notification._id || notification.notification_id || notification.uid || notification.uuid || '');
        return (
          <NotificationCard
            key={id || JSON.stringify(notification)}
            notification={notification}
            isNew={id ? !viewedIds.has(id) : false}
            onView={onView}
          />
        );
      })}
    </Box>
  );
}
