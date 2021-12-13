import express from 'express';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localconfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import { createUser, getPassword } from '../db.js';

const userRouter = express.router();

// generate access tokens
const generateAccessTokens = (email) => {
  jwt.sign(email, localConfig.tokenSecret, { expiresIn: '3600s' });
};

// post request to create user
userRouter.post('/create-user', async (req, res) => {
  console.log('Received POST request.');
  // hashpassword using argon2,
  const hash = await hashPassword(req.body.password);
  const account = {
    username: req.body.username,
    password: hash,
  };
  // send the result to mongo
  const result = await createUser(account);
  res.send(result);
  res.end();
});

userRouter.post('/verify-user', async (req, res, next) => {
  console.log('Received POST request.');
  const verify = await verifyPassword(getPassword(req.body.username), req.body.password);
  if (verify) {
    res.status(200);
    next();
  } else {
    res.status(401);
  }
}, async (req, res) => {
  const token = generateAccessTokens({ email: req.body.email });
  res.send(token);
});

export default userRouter;
