import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import localConfig from '../localConfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import { createUser, createEmployee, getPassword } from '../db.js';
import sendOneTimePasswordByEmail from './email.js';

const userRouter = express.Router();

const verifyToken = async (req, res, next) => {
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(' ')[1];

  if (token === undefined) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, localConfig.tokenSecret, (err, user) => {
      if (err) { res.sendStatus(403); }
      req.managerEmail = user.email;
    });
  }
  next();
};

// generate access tokens
const generateAccessTokens = (email) => jwt.sign(email, localConfig.tokenSecret, { expiresIn: '3600s' });

// post request to create user
userRouter.post('/create-account', async (req, res) => {
  console.log('Received POST request.');
  // hashpassword using argon2,
  const hash = await hashPassword(req.body.password);
  const account = {
    email: req.body.email,
    password: hash,
  };
  // send the result to mongo
  const result = await createUser(account.email, account.password);
  res.send(result);
  res.end();
});

userRouter.post('/create-employee', verifyToken, async (req, res) => {
  console.log('Received POST request.');
  const tempPassword = randomBytes(10).toString('hex');
  const hashedTempPassword = await hashPassword(tempPassword);
  const result = await createEmployee(req.managerEmail, req.body.employeeEmail, hashedTempPassword);
  sendOneTimePasswordByEmail(req.body.employeeEmail, tempPassword);
  res.send(result);
  res.end();
});

userRouter.post('/login', async (req, res, next) => {
  console.log('Received POST request.');
  const verify = await verifyPassword(await getPassword(req.body.email), req.body.password);
  if (verify) {
    res.status(200);
    next();
  } else {
    res.status(401);
  }
}, (req, res) => {
  const token = generateAccessTokens({ email: req.body.email });
  res.send(token);
});

export default userRouter;
