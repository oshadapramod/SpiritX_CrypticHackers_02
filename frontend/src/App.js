import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './Pages/Chatbot/Chatbot';
import Navbar from './Components/Navbar';
import PlayerSelection from './Pages/PlayerSelection/PlayerSelection';
import TeamManagement from './Pages/TeamManagement/TeamManagement';
import Leaderboard from './Pages/Leaderboard/Leaderboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/" element={<PlayerSelection />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;