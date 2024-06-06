import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Box, Grid } from '@mui/material';
import { updateRequest, fetchJson } from './common';

export default function Bingo() {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [introduction, setIntroduction] = useState(localStorage.getItem('introduction') || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(JSON.parse(localStorage.getItem('card')) || []);

  useEffect(() => {
    if (!card.length) {
      fetchJson('card', (response) => {
        localStorage.setItem('card', JSON.stringify(response));
        setCard(response);
      });
    }
  }, [card]);

  const handleSend = async (e) => {
    if (!message)
      return;
    e.preventDefault();
    setLoading(true);
    updateRequest('/prompt', { text: message, name }, (response) => {
      setLoading(false);
      setMessage('');
      setCard(response);
    });
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <Grid container justifyContent="center">
          {card.map((row, i) => (
            <Grid key={i} container item xs={12} justifyContent="center">
              {row.map((cell, j) => (
                <Grid key={j} item>
                  <Typography>{cell}</Typography>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
        {loading && <CircularProgress />}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField label="Enter a prompt..." value={message} onChange={(e) => setMessage(e.target.value)} fullWidth required multiline rows={4}/>
        <Button type="submit" variant="contained" color="primary" disabled={loading} onClick={handleSend}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>
    </Container>
  );
}