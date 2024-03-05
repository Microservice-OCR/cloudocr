import React, { useState } from "react";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vérifiez que les mots de passe correspondent
    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }


    const uri = process.env.REACT_APP_GATEWAY_URI;

    try {
      await axios.post(`${uri}/signup`, {
        email: email,
        password: password,
      });

      navigate('/');
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
            Inscription
        </Typography>
        <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    fullWidth
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    fullWidth
                    label="Confirmez le mot de passe"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Box>
            <Button type="submit" fullWidth variant="contained" color="primary">
                S'inscrire
            </Button>
        </form>
    </Paper>
    );
};

export default SignUpForm;