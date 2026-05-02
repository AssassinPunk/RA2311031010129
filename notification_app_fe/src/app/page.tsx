'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Pagination,
  Button,
} from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';

const NOTIFICATION_TYPES = ['All', 'Placement', 'Result', 'Event'];

export default function AllNotificationsPage() {
  const [filterType, setFilterType] = useState('All');
  const [page, setPage] = useState(1);

  const { notifications, loading, error, refetch, markViewed } =
    useNotifications({
      limit: 10,
      page: page,
      notification_type: filterType === 'All' ? undefined : filterType,
    });

  function handleFilterChange(value: string) {
    setFilterType(value);
    setPage(1);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          All Notifications
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={e => handleFilterChange(e.target.value)}
            >
              {NOTIFICATION_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" size="small" onClick={refetch}>
            Refresh
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading &&
        notifications.map(notification => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            onView={markViewed}
          />
        ))}

      {!loading && notifications.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={10}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}