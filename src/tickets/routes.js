import express from 'express';
import { createTicket, getTicketCollection } from '../db.js';

const router = express.Router();

router.get('/get-ticket-collection', async (req, res) => {
  console.log('Received GET request.');
  const result = await getTicketCollection();
  res.send(result);
  res.end();
});

router.post('/create-ticket', async (req, res) => {
  console.log('Received POST request.');
  const ticket = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  };
  const result = await createTicket(ticket);
  res.send(result);
  res.end();
});

export default router;
