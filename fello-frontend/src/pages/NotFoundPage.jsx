// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Container className="text-center" style={{ marginTop: '100px' }}>
      <h1 style={{ fontSize: '120px', color: '#FF385C' }}>404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button as={Link} to="/" variant="primary">
        Go Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;