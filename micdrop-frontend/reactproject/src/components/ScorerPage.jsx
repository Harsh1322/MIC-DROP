import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import './scorerpage.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import apiClient from '../api';

const ScorerPage = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [votingActive, setVotingActive] = useState(false);
  const [participantId, setParticipantId] = useState(-1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const navigate = useNavigate();
  const {id}=useParams();

//   const handleVote = (value) => {
//     setSelectedValue(value);
//     setDialogMessage('Thank you for voting!');
//     setShowDialog(true);
//     setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
//   };

  const handleTimeOver = () => {
    setDialogMessage('Oops! Time over.');
    setShowDialog(true);
    setVotingActive(false)
    setTimeout(() => navigate('/scorer'), 2000); // Redirect to home after 2 seconds
  };

  useEffect(() => {
    const getParticipantDetails = async () => {
        try {
            const response = await apiClient.get('/api/scorer/get-voting-data');
            setCategory(response.data.category)
            setName(response.data.name)
          
        } catch (error) {
            console.error('Error checking voting status:', error);
        }
    };

    getParticipantDetails();
}, []);

const submitVote = async (score) => {
    try {
        await apiClient.post('/vote', { participant_id: parseInt(id), score });
        setSelectedValue(score);
        setDialogMessage('Thank you for voting! Do not refresh! You will be redirected to another page');
        setShowDialog(true);
        setVotingActive(false)
        setTimeout(() => navigate('/thankyou'), 2000); // Redirect to home after 2 seconds
        
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('Voting is not active or an error occurred.');
    }
};


  return (
    <div className="voting-container">
      <Timer seconds={15} onTimeOver={handleTimeOver} />
      <h1>Score for {name} {category} performance</h1>
      <div className="card-container">
        {Array.from({ length: 10 }, (_, index) => (
          <button
            key={index + 1}
            className="vote-card"
            onClick={() => submitVote(index + 1)}
            disabled={selectedValue !== null}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialogMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScorerPage;
