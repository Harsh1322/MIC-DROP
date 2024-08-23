import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import ScorerDashboard from './components/ScorerDashboard';
import HomePage from './components/HomePage';
import VotingComponent from './components/VotingComponent';
import LakshyaDashboard from './components/LakshyaDashboard';
import ScorerPage from './components/ScorerPage';
import Leaderboard from './components/LeaderBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/scorer" element={<ScorerDashboard />} />
        <Route path="/voter/:id" element={<ScorerPage />} />
        <Route path="/lakshya" element={<LakshyaDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
