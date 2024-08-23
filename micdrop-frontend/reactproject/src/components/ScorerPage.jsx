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

//   useEffect(() => {
//     const checkVotingStatus = async () => {
//         try {
//             const response = await apiClient.get('/admin/voting_status');
//             if(response.data.participant_id!==-1){
//                 setParticipantId(response.data.participant_id)
//                 console.log(response.data.participant_id)
//             // Determine voting status by checking the backend or a specific endpoint
//             setVotingActive(true); // Simulate voting active status
//             setTimeout(() => setVotingActive(false), 30000);}
//         } catch (error) {
//             console.error('Error checking voting status:', error);
//         }
//     };

//     checkVotingStatus();
// }, []);

const submitVote = async (score) => {
    try {
        await apiClient.post('/vote', { participant_id: parseInt(id), score });
        setSelectedValue(score);
        setDialogMessage('Thank you for voting! Do not refresh! You will be redirected to another page');
        setShowDialog(true);
        setVotingActive(false)
        setTimeout(() => navigate('/scorer'), 30000); // Redirect to home after 2 seconds
        
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('Voting is not active or an error occurred.');
    }
};


  return (
    <div className="voting-container">
      <Timer seconds={30} onTimeOver={handleTimeOver} />
      <h1>Vote for Harsh M's performance</h1>
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
