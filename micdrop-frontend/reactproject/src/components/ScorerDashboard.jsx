import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Button, Grid, Box } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContestContext } from '../context/ContestProvider';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import './Welcome.css'

const ScorerDashboard = () => {
  const [episode, setEpisode] = useState('');
  const [contestStarted, setContestStarted] = useState(false);
  const [voting, setVoting] = useState("false");
  const [participants, setParticipants] = useState([]);
  const [votingActive, setVotingActive] = useState(false);
  const [participantId, setParticipantId] = useState(-1);
  const [submittedScores, setSubmittedScores] = useState(new Set());
  const navigate=useNavigate();

  useEffect(() => {
    const fetchContestStatus = async () => {
      try {
        const response = await apiClient.get(`/api/scorer/contest-status?episode=${episode}`);
        setContestStarted(response.data.started);
        setParticipants(response.data.participants);
      } catch (error) {
        console.error("Error fetching contest status:", error);
      }
    };

    fetchContestStatus();
  }, [episode]);

  useEffect(() => {
    const checkVotingStatus = async () => {
        try {
            const response = await apiClient.get('/admin/voting_status');
            if(response.data.participant_id!==-1){
                setParticipantId(response.data.participant_id)
                console.log(response.data.participant_id)
            // Determine voting status by checking the backend or a specific endpoint
            setVotingActive(true); // Simulate voting active status
            navigate(`/voter/${response.data.participant_id}`)
            setTimeout(() => setVotingActive(false), 30000);}
        } catch (error) {
            console.error('Error checking voting status:', error);
        }
    };

    checkVotingStatus();
}, []);

useEffect(() => {
  const getCurrentEpisode = async () => {
      try {
          const response = await apiClient.get('/api/scorer/active-episode-status');
          setEpisode(response.data.active_episode)
          
      } catch (error) {
          console.error('Error checking voting status:', error);
      }
  };

  getCurrentEpisode();
}, []);
  

  const handleScore = async (participantId, score) => {
    if (submittedScores.has(participantId)) {
      alert("You have already scored this participant.");
      return;
    }

    try {
      await apiClient.post(`/api/scorer/submit-score`, { participantId, score });
      setSubmittedScores(new Set([...submittedScores, participantId]));
      alert("Score submitted successfully!");
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };
  const {startContest,setStartContest}=useContext(ContestContext)

 

  return (
    <Container>
  
      {!contestStarted ? (
        // <Typography variant="body1">No contest is currently running. Please wait for the coordinator to start the contest.</Typography>
        <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-heading">Welcome to the Mic Drop competition</h1>
        <h2 className="episode-heading">Episode {episode}</h2>
        <p className="waiting-message">Kindly wait for the scoring to begin</p>
        {/* Instruction Section */}
        <div className="instructions-section">
          <h3 className="instructions-heading">Instructions:</h3>
          <ul className="instructions-list">
            <li>1) As soon as scoring starts, you will be redirected to a new page.</li>
            <li>2) You will have to score the participant by selecting any value from 1-10.</li>
            <li>3) That's it, enjoy and wait for the next marking!!</li>
          </ul>
        </div>
      </div>
      
    </div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>Episode: {episode} </Typography>
          {/* <Typography variant="body1">Please Click on the Score button to register your score</Typography>
          <Button component={Link} to="/voter" variant="contained" color="primary" style={{ margin: '8px' }}>
            Vote Now
          </Button> */}
          {/* <Grid container spacing={2}>
            {participants.map(participant => (
              <Grid item xs={12} sm={6} md={4} key={participant.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{participant.name} - {participant.category}</Typography>
                    <Box mt={2}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                        <Button
                          key={score}
                          variant="contained"
                          color="primary"
                          style={{ margin: '0.5rem' }}
                          onClick={() => handleScore(participant.id, score)}
                        >
                          {score}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}
        </>
      )}
    </Container>
  );
};

export default ScorerDashboard;
