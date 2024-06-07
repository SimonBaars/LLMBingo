import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Box, Grid, Paper } from '@mui/material';
import { updateRequest, fetchJson } from './common';
import Typewriter from 'typewriter-effect';

export default function Bingo() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(JSON.parse(localStorage.getItem('card')) || []);
  const [text, setText] = useState('');

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
    updateRequest('prompt', { prompt: message }, (response) => {
      setLoading(false);
      setMessage('');
      if(!response.text) {
        alert('Something failed, try again :(');
        return;
      }
      setText(response.text);
    });
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <Grid container justifyContent="center" spacing={2}>
          {card.map((row, i) => (
            <Grid key={i} container item xs={12} justifyContent="center">
              {row.map((cell, j) => (
                <Grid key={j} item xs>
                  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                    <Typography>{cell}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
        {loading && 
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
            <CircularProgress />
          </Box>
        }
        {text && 
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 2 }}>
            <Typography variant="h5" sx={{fontWeight: 500}}><Typewriter
  options={{
    strings: text,
    autoStart: true,
    delay: 20,
  }}
/></Typography>
          </Box>
        }
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