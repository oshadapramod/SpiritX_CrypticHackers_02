import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PlayerSelection from './components/PlayerSelection';
import TeamManagement from './components/TeamManagement';
import Leaderboard from './components/Leaderboard';
import Chatbot from './components/Chatbot'; // Ensure this import is correct

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<PlayerSelection />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/chatbot" element={<Chatbot />} /> {/* Ensure this route is correct */}
            </Routes>
        </Router>
    );
};

export default App;