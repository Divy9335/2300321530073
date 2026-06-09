import Link from 'next/link';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';

export default function Layout({ title, children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Medical Notifications
          </Typography>
          <Box>
            <Button color="inherit" component={Link} href="/">
              All Notifications
            </Button>
            <Button color="inherit" component={Link} href="/priority">
              Priority Inbox
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
}
