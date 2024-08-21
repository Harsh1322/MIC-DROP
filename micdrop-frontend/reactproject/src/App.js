import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import ScorerDashboard from './components/ScorerDashboard';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/scorer" element={<ScorerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
