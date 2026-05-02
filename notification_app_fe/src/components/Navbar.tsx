'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          📢 Campus Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<NotificationsIcon />}
            component={Link}
            href="/"
            sx={{
              fontWeight: pathname === '/' ? 'bold' : 'normal',
              borderBottom: pathname === '/' ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            All
          </Button>
          <Button
            color="inherit"
            startIcon={<StarIcon />}
            component={Link}
            href="/priority"
            sx={{
              fontWeight: pathname === '/priority' ? 'bold' : 'normal',
              borderBottom:
                pathname === '/priority' ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}