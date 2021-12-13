import express from 'express';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localconfig.js';
import {
  createTicket, getTicketCollection,
} from '../db.js';

const router = express.Router();

const verifyToken = async (req, res, next) => {
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(' ')[1];

  if (token == null) res.sendStatus(401);

  jwt.verify(token, localConfig.tokenSecret, (err, email) => {
    console.log(err);

    if (err) { res.sendStatus(403); }

    req.userEmail = email;

    next();
  });
};

router.post('/create-ticket', verifyToken, async (req, res) => {
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(' ')[1];
  if (token == null) { console.log('Received POST request.'); }
  const ticket = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    priority: req.body.priority,
    urgency: req.body.urgency,
    date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  };
  const result = await createTicket(req.userEmail, ticket);
  res.send(result);
  res.end();
});

router.get('/get-ticket-collection', async (req, res) => {
  console.log('Received GET request.');
  const result = await getTicketCollection();
  res.send(result);
  res.end();
});

export default router;
