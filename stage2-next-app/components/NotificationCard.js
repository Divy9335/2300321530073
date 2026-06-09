import { Card, CardActionArea, CardContent, Chip, Stack, Typography, Box } from '@mui/material';

const typeColors = {
  Placement: 'primary',
  Result: 'success',
  Event: 'warning',
  Unknown: 'default'
};

export default function NotificationCard({ notification, isNew, onView }) {
  const type = notification.notification_type || notification.type || 'Unknown';
  const timestamp = notification.createdAt || notification.publishedAt || notification.timestamp || notification.date || '';
  const dateLabel = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown time';

  return (
    <Card variant="outlined" sx={{ mb: 2, borderLeft: isNew ? 4 : 1, borderColor: isNew ? 'primary.main' : 'divider' }}>
      <CardActionArea onClick={() => onView?.(notification)}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {dateLabel}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {notification.title || notification.message || 'Untitled notification'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.details || notification.description || notification.body || 'No details available.'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label={type} color={typeColors[type] || 'default'} />
              {isNew && <Chip label="New" color="secondary" />}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
