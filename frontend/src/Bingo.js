import React, { useState } from 'react';
import { Button, TextField, Container, Typography, CircularProgress, Box } from '@mui/material';
import { updateRequest } from './common';

export default function Bingo() {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [introduction, setIntroduction] = useState(localStorage.getItem('introduction') || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(!localStorage.getItem('name'));

  const handleSubmit = async (e) => {
    if(!name)
      return;
    e.preventDefault();
    localStorage.setItem('name', name);
    localStorage.setItem('introduction', introduction);
    updateRequest('/api/create_player', { name, introduction });
    setFormVisible(false);
  };

  const handleSend = async (e) => {
    if (!message)
      return;
    e.preventDefault();
    setLoading(true);
    updateRequest('/api/message', { text: message, name }, () => {setLoading(false);setMessage('');});
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        LLM Bingo
      </Typography>
      {formVisible ? (
        <form onSubmit={handleSubmit}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required sx={{mb:2}}/>
          <TextField label="Introduction" value={introduction} onChange={(e) => setIntroduction(e.target.value)} fullWidth required />
          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      ) : (
        <form onSubmit={handleSend}>
          <TextField label="Interact with the AI" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth required multiline rows={4}/>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
}
