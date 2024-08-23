import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../api';

const VotingComponent = () => {
    const [votingActive, setVotingActive] = useState(false);
    const [selectedScore, setSelectedScore] = useState(null);
    const [participantId, setParticipantId] = useState(-1);

    useEffect(() => {
        const checkVotingStatus = async () => {
            try {
                const response = await apiClient.get('/admin/voting_status');
                if(response.data.participant_id!==-1){
                    setParticipantId(response.data.participant_id)
                    console.log(response.data.participant_id)
                // Determine voting status by checking the backend or a specific endpoint
                setVotingActive(true); // Simulate voting active status
                setTimeout(() => setVotingActive(false), 30000);}
            } catch (error) {
                console.error('Error checking voting status:', error);
            }
        };

        checkVotingStatus();
    }, []);

    const submitVote = async (score) => {
        setSelectedScore(score);
        try {
            await apiClient.post('/vote', { participant_id: participantId, score });
            alert('Vote recorded!');
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Voting is not active or an error occurred.');
        }
    };

    return (
        <div>
            <h1>Participant {participantId}</h1>
            {votingActive ? (
                <div>
                    {[...Array(10)].map((_, i) => (
                        <button key={i} onClick={() => submitVote(i + 1)} disabled={selectedScore !== null}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            ) : (
                <p>Voting is not active</p>
            )}
        </div>
    );
};

export default VotingComponent;
