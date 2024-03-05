import React from 'react';
import { Button, Paper, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token JWT stocké
        localStorage.removeItem('token'); // ou Cookies.remove('token') si vous utilisez des cookies

        // Rediriger vers la page de connexion ou toute autre page
        navigate('/');
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Déconnexion
            </Typography>
            <Box textAlign="center">
                <Button onClick={handleLogout} variant="contained" color="primary">
                    Se déconnecter
                </Button>
            </Box>
        </Paper>
    );
};

export default Logout;
