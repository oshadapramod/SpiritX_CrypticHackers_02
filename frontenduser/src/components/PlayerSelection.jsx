import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PlayerSelection.css'; // Ensure this file exists and contains the CSS below

const PlayerSelection = () => {
    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', university: 'University A', value: 1000000, image: 'https://via.placeholder.com/80' },
        { id: 2, name: 'Player 2', university: 'University B', value: 2000000, image: 'https://via.placeholder.com/80' },
        { id: 3, name: 'Player 3', university: 'University C', value: 3000000, image: 'https://via.placeholder.com/80' },
    ]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [budget, setBudget] = useState(9000000);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showHero, setShowHero] = useState(true); // State to control hero section visibility
    const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position

    const handleSelectPlayer = (player) => {
        if (selectedPlayers.includes(player)) {
            setErrorMessage(`${player.name} is already selected.`);
            return;
        }
        if (budget - player.value < 0) {
            setErrorMessage(`Insufficient budget to select ${player.name}.`);
            return;
        }
        setSelectedPlayers([...selectedPlayers, player]);
        setBudget(budget - player.value);
        setErrorMessage('');
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Scroll event handler
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Scrolling down
                setShowHero(false);
            } else {
                // Scrolling up
                setShowHero(true);
            }

            setLastScrollY(currentScrollY); // Update last scroll position
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        SpiritII Fantasy Cricket
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">
                                    Player Selection
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/team">
                                    Team Management
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/leaderboard">
                                    Leaderboard
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/chatbot">
                                    Chatbot
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <button className="btn btn-outline-light">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className={`hero-section ${showHero ? 'visible' : 'hidden'}`}>
                <div className="hero-content">
                    <h1 className="hero-text animate-pop-in">Time to select your team</h1>
                    <div className="hero-search-container animate-pop-in">
                        <input
                            type="search"
                            className="form-control hero-search"
                            placeholder="Search Players"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search Players"
                        />
                    </div>
                </div>
            </div>

            {/* Budget Display */}
            <div className="budget-display">
                <div className="budget-card">
                    <div className="budget-icon">
                        💰 {/* You can replace this with an icon from a library like FontAwesome */}
                    </div>
                    <h2>Remaining Budget</h2>
                    <p className="budget-amount">Rs. {budget.toLocaleString()}</p>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="error-message">
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Player Cards */}
            <div className="player-cards">
                {filteredPlayers.map((player) => (
                    <div key={player.id} className="player-card">
                        <div className="card">
                            <div className="card-body">
                                {/* Player Image */}
                                <img
                                    src={player.image}
                                    alt={player.name}
                                    className="player-image"
                                />
                                {/* Player Details */}
                                <div className="player-details">
                                    <h3>{player.name}</h3>
                                    <p>{player.university}</p>
                                    <p>Value: Rs. {player.value.toLocaleString()}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSelectPlayer(player)}
                                        disabled={selectedPlayers.includes(player) || budget - player.value < 0}
                                    >
                                        {selectedPlayers.includes(player) ? 'Selected' : 'Select'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerSelection;