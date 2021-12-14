import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import localConfig from '../localconfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import { createUser, getPassword } from '../db.js';

const userRouter = express.Router();

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
