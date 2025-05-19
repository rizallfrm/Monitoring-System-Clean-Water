import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout" style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthLayout;