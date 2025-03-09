import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([
        { username: 'User1', team_points: 100 },
        { username: 'User2', team_points: 200 },
        { username: 'User3', team_points: 300 },
    ]);

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
                Leaderboard
            </Typography>
            <TableContainer component={Paper} style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <Table>
                    <TableHead style={{ background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)' }}>
                        <TableRow>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Team Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((user, index) => (
                            <TableRow
                                key={user.username}
                                style={{ background: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                                component={motion.tr}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.team_points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Leaderboard;