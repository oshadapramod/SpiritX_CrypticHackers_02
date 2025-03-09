import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import backgroundImage from './background.avif';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hi! I\'m Spiriter, your cricket fantasy assistant. Ask me about players, stats, or request the best possible team!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previousSearches, setPreviousSearches] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Only scroll if it's not the initial page load
        if (!initialLoad) {
            scrollToBottom();
        } else {
            setInitialLoad(false);
        }
    }, [messages, initialLoad]);

    // Focus input when component loads
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Suggested questions for the user
    const suggestedQuestions = [
        "Suggest the best possible team of 11 players",
        "Tell me about Chamika Chandimal's stats",
        "What is Wanindu Hasaranga's bowling economy?",
        "What university does Lahiru Rathnayake play for?",
        "What is the value of Bhanuka Rajapaksa?"
    ];

    // Maintain a list of recent player searches to make easier to find
    const updatePreviousSearches = (messageText) => {
        // Extract player name using regex - basic version
        const nameMatch = messageText.match(/about\s+([a-zA-Z\s]+)|player\s+([a-zA-Z\s]+)|([a-zA-Z\s]+)'s\s+stats/i);
        if (nameMatch) {
            const playerName = (nameMatch[1] || nameMatch[2] || nameMatch[3]).trim();
            // Add to previous searches if not already there
            setPreviousSearches(prev => {
                if (!prev.includes(playerName) && playerName.length > 2) {
                    return [playerName, ...prev].slice(0, 5); // Keep only the 5 most recent
                }
                return prev;
            });
        }
    };

    const sendMessage = async (messageText = input) => {
        if (!messageText.trim() || isLoading) return;

        // Trim whitespace
        messageText = messageText.trim();

        const userMessage = { role: 'user', content: messageText };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        // Update recent searches
        updatePreviousSearches(messageText);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.reply) {
                throw new Error('No reply received from server');
            }

            // Format messages with line breaks preserved
            const formattedReply = data.reply.replace(/\n/g, '<br>');
            const botMessage = { role: 'bot', content: formattedReply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
            
            // Focus back on input after bot responds
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setError(error.message);
            setMessages(prevMessages => [...prevMessages, { 
                role: 'bot', 
                content: `Sorry, I encountered an error. Please try again later.` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessage();
        }
    };

    const handleSuggestedQuestion = (question) => {
        sendMessage(question);
    };

    const clearChat = () => {
        setMessages([
            { role: 'bot', content: 'Hi! I\'m Spiriter, your cricket fantasy assistant. Ask me about players, stats, or request the best possible team!' }
        ]);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Spiriter Chatbot</h2>
                {messages.length > 3 && (
                    <button 
                        className="clear-chat-button" 
                        onClick={clearChat}
                        disabled={isLoading}
                    >
                        Clear Chat
                    </button>
                )}
            </div>
            
            <p className="chatbot-intro">
                Ask me about player stats, team recommendations, or anything about cricket fantasy!
            </p>
            
            <div className={`chatbox ${messages.length > 3 ? 'expanded' : ''}`}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
                        <span className="message-role">{msg.role === 'user' ? 'You' : 'Spiriter'}</span>
                        <div 
                            className="message-content" 
                            dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                    </div>
                ))}
                {isLoading && <div className="bot-message loading">
                    <span className="message-role">Spiriter</span>
                    <div className="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>}
                <div ref={messagesEndRef} />
            </div>
            
            {messages.length <= 3 && (
                <div className="suggested-questions">
                    <h4>Try asking:</h4>
                    <div className="questions-container">
                        {suggestedQuestions.map((question, index) => (
                            <button 
                                key={index} 
                                className="question-button"
                                onClick={() => handleSuggestedQuestion(question)}
                                disabled={isLoading}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {previousSearches.length > 0 && (
                <div className="previous-searches">
                    <h4>Recent players:</h4>
                    <div className="searches-container">
                        {previousSearches.map((player, index) => (
                            <button 
                                key={index} 
                                className="search-button"
                                onClick={() => sendMessage(`Tell me about ${player}'s stats`)}
                                disabled={isLoading}
                            >
                                {player}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="input-container">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about players, stats or best team..."
                    disabled={isLoading}
                    ref={inputRef}
                />
                <button 
                    className="send-button" 
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
            
            {error && <div className="error-message">Error: {error}</div>}
        </div>
    );
};

function setupCricketBackground() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'background-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    // Add the necessary CSS for the canvas and background
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1)), url('${backgroundImage}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            margin: 0;
            padding: 0;
        }
        .background-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: transparent; /* Changed from solid color to transparent */
        }
    `;
    document.head.appendChild(style);

    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cricket elements
    const elementsCount = 60;
    const elements = [];
    const cricketItems = ['🏏', '🏆', '⚾', '🧢']; // Cricket bat, trophy, ball, cap

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };

    class CricketElement {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 15 + Math.random() * 10;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.type = cricketItems[Math.floor(Math.random() * cricketItems.length)];
            this.angle = 0;
            this.spin = (Math.random() - 0.5) * 0.02;
            this.opacity = 0.1 + Math.random() * 0.3;
        }

        update() {
            // Move elements
            this.x += this.speedX;
            this.y += this.speedY;
            this.angle += this.spin;

            // Bounce off walls
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Calculate angle to mouse
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius * 2;
                    
                    // Push elements away from mouse
                    this.x += Math.cos(angle) * force;
                    this.y += Math.sin(angle) * force;
                    
                    // Increase spin when interacting with mouse
                    this.spin = this.spin * 1.05;
                    if (Math.abs(this.spin) > 0.2) {
                        this.spin = 0.2 * Math.sign(this.spin);
                    }
                }
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.type, 0, 0);
            ctx.restore();
        }
    }

    // Create cricket elements
    function createCricketElements() {
        for (let i = 0; i < elementsCount; i++) {
            elements.push(new CricketElement());
        }
    }

    // Connection lines between elements
    function drawConnections() {
        const connectionDistance = 150;
        
        ctx.lineWidth = 1;
        
        for (let i = 0; i < elements.length; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                const dx = elements[i].x - elements[j].x;
                const dy = elements[i].y - elements[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Opacity based on distance
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(elements[i].x, elements[i].y);
                    ctx.lineTo(elements[j].x, elements[j].y);
                    ctx.strokeStyle = `rgba(83, 5, 118, ${opacity * 0.2})`;
                    ctx.stroke();
                }
            }
        }
    }

    // Track mouse position
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    canvas.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawConnections();
        
        // Update and draw elements
        for (let i = 0; i < elements.length; i++) {
            elements[i].update();
            elements[i].draw();
        }
        
        requestAnimationFrame(animate);
    }

    createCricketElements();
    animate();
}

// Initialize the cricket background when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCricketBackground();
});

export default Chatbot;