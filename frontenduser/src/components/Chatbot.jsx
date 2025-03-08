import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            // Simulate a bot response
            setTimeout(() => {
                setMessages([...messages, { text: input, sender: 'user' }, { text: 'Hello! How can I assist you?', sender: 'bot' }]);
            }, 1000);
        }
    };

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
                Chatbot
            </Typography>
            <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <CardContent>
                    <Box style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: message.sender === 'user' ? 'right' : 'left',
                                    marginBottom: '10px',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    style={{
                                        display: 'inline-block',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: message.sender === 'user' ? '#6a11cb' : '#2575fc',
                                        color: 'white',
                                    }}
                                >
                                    {message.text}
                                </Typography>
                            </div>
                        ))}
                    </Box>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            style={{ marginLeft: '10px' }}
                        >
                            Send
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default Chatbot;