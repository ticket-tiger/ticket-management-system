import express from 'express';
import jwt from 'jsonwebtoken';
import localConfig from '../localConfig.js';
import {
  createTicket, getCurrentStatusTitleEmail, getTickets, updateTicket, deleteTicket,
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
        res.locals.userEmail = tokenUser.email;
        res.locals.userRole = tokenUser.role;
        // Generate new token to extend user session to 15 minutes again
        res.clearCookie('token');
        const newToken = generateAccessTokens({ email: tokenUser.email, role: tokenUser.role });
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
  try {
    const ticket = {
      title: req.body.ticket.title,
      description: req.body.ticket.description,
      category: req.body.ticket.category,
      status: 'Submitted',
      priority: req.body.ticket.priority,
      urgency: req.body.ticket.urgency,
      date: new Date(),
      email: req.body.email,
    };
    const result = await createTicket(req.body.email, ticket);
    res.send(result);
  } catch (error) {
    res.sendStatus(500);
  }
  res.end();
});

router.get('/get-tickets', verifyToken, async (req, res) => {
  console.log('Received GET request.');
  try {
    const result = await getTickets(res.locals.userEmail);
    res.send(result);
  } catch (error) {
    res.sendStatus(500);
  }
  res.end();
});

router.post('/update-ticket', verifyToken, async (req, res) => {
  console.log('Received POST request');
  try {
    if (res.locals.userRole === 'Employee' || res.locals.userRole === 'Manager') {
      const { status, title, email } = await getCurrentStatusTitleEmail(
        req.body.email, req.body._id,
      );
      const result = await updateTicket(res.locals.userEmail, req.body._id, req.body);
      if (status !== req.body.status) {
        await sendStatusUpdateByEmail(
          email, title, status, req.body.status,
        );
      }
      res.send(result);
    } else res.sendStatus(403);
  } catch (error) {
    res.sendStatus(500);
  }
  res.end();
});

router.post('/delete-ticket', verifyToken, async (req, res) => {
  console.log('Received POST request');
  try {
    if (res.locals.userRole === 'Manager') {
      const result = await deleteTicket(req.body.email, req.body._id);
      res.send(result);
    } else res.sendStatus(403);
  } catch (error) {
    res.sendStatus(500);
  }
  res.end();
});

export default router;
