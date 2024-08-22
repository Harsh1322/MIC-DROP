import React from 'react';
import axios from 'axios';

const LakshyaDashboard = () => {
    const activateVoting = async () => {
        try {
            await axios.post('/admin/activate_voting', { participant_id: 1});
            alert('Voting activated for 30 seconds');
        } catch (error) {
            console.error('Error activating voting:', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={activateVoting}>Activate Voting</button>
        </div>
    );
};

export default LakshyaDashboard;
