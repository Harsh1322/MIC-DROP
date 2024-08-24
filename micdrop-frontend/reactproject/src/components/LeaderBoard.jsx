import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Card, CardContent, Select, Box} from '@mui/material';
import apiClient from '../api';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const response = await apiClient.get('/leaderboard');
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <Typography variant="h6">Participants</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Vote</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((participant,index) => (
            <TableRow key={index+1}>
                <TableCell>{index+1}</TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.category}</TableCell>
              <TableCell>{participant.score}</TableCell>
              <TableCell>{participant.vote_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </div>
    );
};

export default Leaderboard;
