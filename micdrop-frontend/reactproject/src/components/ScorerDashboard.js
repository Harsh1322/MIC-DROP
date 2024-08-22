import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Button, Grid, Box } from '@mui/material';
import apiClient from '../api';

const ScorerDashboard = () => {
  const [episode, setEpisode] = useState('');
  const [contestStarted, setContestStarted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [submittedScores, setSubmittedScores] = useState(new Set());

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome to Mic Drop</Typography>

      {!contestStarted ? (
        <Typography variant="body1">No contest is currently running. Please wait for the coordinator to start the contest.</Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>Episode: {episode}</Typography>
          <Grid container spacing={2}>
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
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ScorerDashboard;
