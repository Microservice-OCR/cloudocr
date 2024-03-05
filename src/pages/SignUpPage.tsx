import React from 'react';
import SignUpForm from '../components/SignUpForm';
import { Container } from '@mui/material';

const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <SignUpForm />
        </Container>
    );
}

export default LoginPage;
