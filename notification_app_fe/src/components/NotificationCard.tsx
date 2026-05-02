'use client';

import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Notification } from '../utils/priorityScore';

interface Props {
  notification: Notification;
  onView: (id: string) => void;
  rank?: number;
}

const TYPE_COLOR: Record<string, 'success' | 'warning' | 'info'> = {
  Placement: 'success',
  Result: 'warning',
  Event: 'info',
};

export default function NotificationCard({ notification, onView, rank }: Props) {
  const isNew = !notification.viewed;

  function handleClick() {
    if (isNew) onView(notification.ID);
  }

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 2,
        cursor: isNew ? 'pointer' : 'default',
        border: isNew ? '2px solid #1976d2' : '2px solid #e0e0e0',
        backgroundColor: isNew ? '#f0f7ff' : '#ffffff',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: isNew ? 4 : 1,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {rank && (
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                #{rank}
              </Typography>
            )}
            <Chip
              label={notification.Type}
              color={TYPE_COLOR[notification.Type] || 'default'}
              size="small"
            />
            {isNew && (
              <Chip label="NEW" color="primary" size="small" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="body1" fontWeight={isNew ? 'bold' : 'normal'}>
          {notification.Message}
        </Typography>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 1, display: 'block' }}
        >
          ID: {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
}