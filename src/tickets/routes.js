import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localConfig.js';
import {
  createTicket, getCurrentStatusTitleEmail, getTickets, updateTicket,
} from '../db.js';
import { sendStatusUpdateByEmail } from '../users/email.js';

const router = express.Router();

const generateAccessTokens = (email) => jwt.sign(email, localConfig.tokenSecret, { expiresIn: '900s' });

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;
  if (token === undefined) {
    res.sendStatus(401);
    res.end();
  } else {
    jwt.verify(token, localConfig.tokenSecret, { maxAge: '900s' }, (err, tokenUser) => {
      if (err) {
        res.sendStatus(403);
        res.end();
      } else {
        req.userEmail = tokenUser.email;
        res.clearCookie('token');
        const newToken = generateAccessTokens({ email: tokenUser.email });
        res.cookie('token', newToken, { httpOnly: true, maxAge: 900000 });
        const { user } = req.cookies;
        res.clearCookie('user');
        res.cookie('user', user, { maxAge: 900000, encode: (str) => str });
        next();
      }
    });
  }
};

router.post('/create-ticket', async (req, res) => {
  console.log('Received POST request.');
  const ticket = {
    title: req.body.ticket.title,
    description: req.body.ticket.description,
    category: req.body.ticket.category,
    status: 'Submitted',
    priority: req.body.ticket.priority,
    urgency: req.body.ticket.urgency,
    date: new Date(),
    // .toLocaleString('en-US', { timeZone: 'America/New_York' }),
    email: req.body.email,
  };
  const result = await createTicket(req.body.email, ticket);
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
  const { status, title, email } = await getCurrentStatusTitleEmail(
    req.body.email, req.body._id,
  );
  const result = await updateTicket(req.userEmail, req.body._id, req.body);
  if (status !== req.body.status) {
    await sendStatusUpdateByEmail(
      email, title, status, req.body.status,
    );
  }
  res.send(result);
  res.end();
});

export default router;
