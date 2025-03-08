import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const handleLogout = () => {
        // Add your logout logic here
        console.log('User logged out');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    SpiritII Fantasy Cricket
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page">
                                <HomeIcon style={{ fontSize: '18px', marginRight: '5px' }} />
                                Player Selection
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/team" className="nav-link">
                                <GroupIcon style={{ fontSize: '18px', marginRight: '5px' }} />
                                Team Management
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/leaderboard" className="nav-link">
                                <LeaderboardIcon style={{ fontSize: '18px', marginRight: '5px' }} />
                                Leaderboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/chatbot" className="nav-link">
                                <ChatIcon style={{ fontSize: '18px', marginRight: '5px' }} />
                                Chatbot
                            </Link>
                        </li>
                    </ul>
                    {/* Logout Button */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="btn btn-outline-light" onClick={handleLogout}>
                                <LogoutIcon style={{ fontSize: '18px', marginRight: '5px' }} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;