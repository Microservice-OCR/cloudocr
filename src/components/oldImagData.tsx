import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';
import { IFile } from '../models';
 

export const UserImages: React.FC<{}> = () => {
    const [images, setImages] = useState<IFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const userId = localStorage.getItem('id');
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_SAVE_IMG_URI}/user/${userId}`;
            try {
                const response = await axios.get<IFile[]>(apiUrl);
                setImages(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des images', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [userId]);

    return (
        <Paper elevation={3} style={{ padding: '20px', marginRight:'0', maxWidth: '450px' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Vos photos
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {images.map((image) => (
                        <Grid item xs={12} sm={6} md={6} key={image.ID}>
                            <Card>
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {image.Name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Type: {image.ContentType}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {image.Fulltext ? `Texte extrait: ${image.Fulltext}` : 'Aucun texte extrait'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default UserImages;
