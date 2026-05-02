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
  Button,
  Chip,
} from '@mui/material';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationCard from '../../components/NotificationCard';
import { getTopN } from '../../utils/priorityScore';

const TOP_N_OPTIONS = [5, 10, 15, 20];

export default function PriorityInboxPage() {
  const [topN, setTopN] = useState(10);

  const { notifications, loading, error, refetch, markViewed } =
    useNotifications();

  const priorityNotifications = getTopN(notifications, topN);
  const newCount = priorityNotifications.filter(n => !n.viewed).length;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            ⭐ Priority Inbox
          </Typography>
          {newCount > 0 && (
            <Chip label={`${newCount} new`} color="primary" size="small" />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Show Top</InputLabel>
            <Select
              value={topN}
              label="Show Top"
              onChange={e => setTopN(Number(e.target.value))}
            >
              {TOP_N_OPTIONS.map(n => (
                <MenuItem key={n} value={n}>
                  Top {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" size="small" onClick={refetch}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Showing top {topN} notifications ranked by priority (Placement &gt; Result &gt; Event) and recency.
        Click a notification to mark it as viewed.
      </Alert>

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

      {!loading &&
        priorityNotifications.map((notification, index) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            onView={markViewed}
            rank={index + 1}
          />
        ))}
    </Container>
  );
}