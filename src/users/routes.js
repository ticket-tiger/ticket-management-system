import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import localConfig from '../localConfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import {
  createUser, createEmployee, createPermanentPassword, getPasswordInfo,
} from '../db.js';
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
    name: req.body.name,
    password: hash,
  };
  // send the result to mongo
  try {
    const result = await createUser(account.email, account.name, account.password);
    res.send(result);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      res.send('Your email is not unique.');
    } else {
      res.status(500);
      res.send('There was a problem');
    }
  } res.end();
});

userRouter.post('/create-employee', verifyToken, async (req, res) => {
  console.log('Received POST request.');
  const tempPassword = randomBytes(10).toString('hex');
  const hashedTempPassword = await hashPassword(tempPassword);
  const result = await createEmployee(req.managerEmail, req.body, hashedTempPassword);
  sendOneTimePasswordByEmail(req.body.email, tempPassword);
  res.send(result);
  res.end();
});

userRouter.post('/login', async (req, res, next) => {
  console.log('Received POST request.');
  try {
    const passwordInfo = await getPasswordInfo(req.body.email);
    const verify = await verifyPassword(passwordInfo.password, req.body.password);
    res.locals.isOneTimePassword = passwordInfo.isOneTimePassword;
    res.locals.passwordExpirationDate = passwordInfo.passwordExpirationDate;
    if (verify) {
      res.status(200);
      next();
    } else {
      res.status(401);
      res.end();
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    res.end();
  }
}, (req, res) => {
  const token = generateAccessTokens({ email: req.body.email });
  res.send({
    token,
    isOneTimePassword: res.locals.isOneTimePassword,
    passwordExpirationDate: res.locals.passwordExpirationDate,
  });
  res.end();
});

userRouter.post('/create-permanent-password', verifyToken, async (req, res) => {
  console.log('Received POST request.');
  const hashedPassword = await hashPassword(req.body.newPassword);
  const result = await createPermanentPassword(req.managerEmail, hashedPassword);
  res.send(result);
  res.end();
});

export default userRouter;
