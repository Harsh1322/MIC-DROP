import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Card, CardContent } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>Welcome to Mic Drop</Typography>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Login As:</Typography>
          <Button component={Link} to="/admin" variant="contained" color="primary" style={{ margin: '8px' }}>
            Admin Dashboard
          </Button>
          <Button component={Link} to="/coordinator" variant="contained" color="success" style={{ margin: '8px' }}>
            Coordinator Dashboard
          </Button>
          <Button component={Link} to="/scorer" variant="contained" color="error" style={{ margin: '8px' }}>
            Scorer Dashboard
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomePage;
