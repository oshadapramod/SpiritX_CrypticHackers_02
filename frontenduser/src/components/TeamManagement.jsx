import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const TeamManagement = () => {
    // Mock data for selected players
    const [selectedPlayers, setSelectedPlayers] = useState([
        { id: 1, name: 'Player 1', university: 'University A', value: 1000000 },
        { id: 2, name: 'Player 2', university: 'University B', value: 2000000 },
    ]);
    const [budget, setBudget] = useState(9000000);

    const handleRemovePlayer = (player) => {
        setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
        setBudget(prevBudget => prevBudget + player.value);
    };

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
                Your Team
            </Typography>
            <Grid container spacing={3}>
                <AnimatePresence>
                    {selectedPlayers.map((player, index) => (
                        <Grid item key={player.id} xs={12} sm={6} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <CardContent style={{ textAlign: 'center' }}>
                                        <Typography variant="h6" style={{ color: '#333', fontWeight: 'bold' }}>
                                            {player.name}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: '#777' }}>
                                            {player.university}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: '#555', margin: '10px 0' }}>
                                            Value: Rs. {player.value.toLocaleString()}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleRemovePlayer(player)}
                                            style={{ borderRadius: '25px', fontWeight: 'bold' }}
                                        >
                                            Remove
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </AnimatePresence>
            </Grid>
        </div>
    );
};

export default TeamManagement;