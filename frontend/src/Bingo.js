import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Box, Grid, Paper } from '@mui/material';
import { updateRequest, fetchJson } from './common';
import Typewriter from 'typewriter-effect';

export default function Bingo() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState(JSON.parse(localStorage.getItem('card')) || []);
  const [matched, setMatched] = useState(JSON.parse(localStorage.getItem('matched')) || []);
  const [text, setText] = useState('');
  const [attempts, setAttempts] = useState(JSON.parse(localStorage.getItem('attempts')) || 0);
  const [finishedState, setFinishedState] = useState(false);

  useEffect(() => {
    if (!card.length) {
      fetchJson('card', (response) => {
        localStorage.setItem('card', JSON.stringify(response));
        setCard(response);
        const initialMatched = response.map(row => row.map(() => false));
        localStorage.setItem('matched', JSON.stringify(initialMatched));
        setMatched(initialMatched);
      });
    }
  }, [card]);

  const handleSend = (e) => {
    if (!message)
      return;
    e.preventDefault();
    setLoading(true);
    updateRequest('prompt', { prompt: message }, (response) => {
      setLoading(false);
      setMessage('');
      setAttempts(prevAttempts => prevAttempts + 1);
      const res = response.text;
      if(!res) {
        alert('Something failed, try again :(');
        return;
      }

      const lowerCaseResponse = res.toLowerCase();
      const newMatched = [...matched];
      for (let i = 0; i < card.length; i++) {
        for (let j = 0; j < card[i].length; j++) {
          if (lowerCaseResponse.includes(card[i][j].toLowerCase())){
            newMatched[i][j] = true;
          }
        }
      }
      localStorage.setItem('matched', JSON.stringify(newMatched));
      setMatched(newMatched);
      setText(res);
    });
  };
  const totalCards = card.flat().length;
  const nFound = matched.flat().filter(Boolean).length;
  const score = ((nFound + 1) * 100) - attempts;

  const finishGame = () => {
    setLoading(true);
    const name = prompt('Enter your name for the leaderboard:');
    if (!name) {
      setLoading(false);
      return;
    }
    updateRequest('score', { score, name }, (response) => {
      setLoading(false);
      setFinishedState(true);
      localStorage.clear();
      setText(`Congratulations on finding ${nFound} out of ${totalCards} cards! Your score is ${score}.\n\nCurrent leaderboard:\n${response.map((entry, i) => `${i + 1}. ${entry.name} - ${entry.score}`).join('\n')}`);
    });
  };

  const newGame = () => {
    setCard([]);
    setMatched([]);
    setAttempts(0);
    setFinishedState(false);
    setText('');
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: { sm: 'row' }, justifyContent: 'space-around', alignItems: 'center', marginBottom: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
          <Typography variant="h4">{attempts}</Typography>
          <Typography variant="subtitle1">Attempts</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
          <Typography variant="h4">{score}</Typography>
          <Typography variant="subtitle1">Score</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
          {finishedState ? 
          (<Button variant="contained" color="primary" onClick={newGame}>New Game</Button>) :
          (<Button variant="contained" color="primary" disabled={!matched.flat().includes(true)} onClick={finishGame}>Finish</Button>)}
        </Box>
      </Box>
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <Grid container justifyContent="center" spacing={2}>
          {card.map((row, i) => (
            <Grid key={i} container item xs={12} justifyContent="center">
              {row.map((cell, j) => (
                <Grid key={j} item xs>
                  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', background: matched[i][j] ? '#bbff9c' : 'white' }}>
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
      {!finishedState && (<Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField label="Enter a prompt..." value={message} onChange={(e) => setMessage(e.target.value)} fullWidth required multiline rows={4}/>
        <Button type="submit" variant="contained" color="primary" disabled={loading} onClick={handleSend}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </Box>)}
    </Container>
  );
}