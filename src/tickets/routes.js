import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localConfig.js';
import {
  createTicket, getTicketCollection,
} from '../db.js';

const router = express.Router();

const verifyToken = async (req, res, next) => {
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(' ')[1];

  if (token === undefined) {
    req.userEmail = req.body.email;
  } else {
    jwt.verify(token, localConfig.tokenSecret, (err, user) => {
      if (err) { res.status(403); }
      req.userEmail = user.email;
    });
  }
  next();
};

router.post('/create-ticket', verifyToken, async (req, res) => {
  console.log('Received POST request.');
  const ticket = {
    title: req.body.ticket.title,
    description: req.body.ticket.description,
    category: req.body.ticket.category,
    priority: req.body.ticket.priority,
    urgency: req.body.ticket.urgency,
    date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  };
  const result = await createTicket(req.userEmail, ticket);
  res.send(result);
  res.end();
});

router.get('/get-tickets', verifyToken, async (req, res) => {
  console.log('Received GET request.');
  const result = await getTicketCollection(req.userEmail);
  res.send(result);
  res.end();
});

export default router;
