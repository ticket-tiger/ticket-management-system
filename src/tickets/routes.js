import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localConfig.js';
import {
  createTicket, getCurrentStatusTitleEmail, getTickets, updateTicket,
} from '../db.js';
import { sendStatusUpdateByEmail } from '../users/email.js';

const router = express.Router();

const verifyToken = async (req, res, next) => {
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(' ')[1];

  if (token === undefined) {
    req.userEmail = req.body.email;
  } else {
    jwt.verify(token, localConfig.tokenSecret, (err, user) => {
      if (err) { res.sendStatus(403); }
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
    status: 'Submitted',
    priority: req.body.ticket.priority,
    urgency: req.body.ticket.urgency,
    date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    email: req.userEmail,
  };
  const result = await createTicket(req.userEmail, ticket);
  res.send(result);
  res.end();
});

router.get('/get-tickets', verifyToken, async (req, res) => {
  console.log('Received GET request.');
  const result = await getTickets(req.userEmail);
  res.send(result);
  res.end();
});

router.post('/update-ticket', verifyToken, async (req, res) => {
  console.log('Received POST request');
  let result;
  if (req.body.status) {
    // Get current status and send email to the user
    const { currentStatus, title, email } = await getCurrentStatusTitleEmail(
      req.body.email, req.body._id,
    );
    result = await updateTicket(req.userEmail, req.body._id, req.body);
    sendStatusUpdateByEmail(
      email, title, currentStatus, req.body.status,
    );
  } else {
    result = await updateTicket(req.userEmail, req.body._id, req.body);
  }
  res.send(result);
  res.end();
});

export default router;
