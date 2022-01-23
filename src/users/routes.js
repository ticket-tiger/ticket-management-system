import express from 'express';
// import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import localConfig from '../localConfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import {
  createUser, createEmployee, createPermanentPassword, getUserInfo,
} from '../db.js';
import { sendOneTimePasswordByEmail } from './email.js';

const userRouter = express.Router();

const generateAccessTokens = (email) => jwt.sign(email, localConfig.tokenSecret, { expiresIn: '900s' });

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (token === undefined) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, localConfig.tokenSecret, { maxAge: '900s' }, (err, tokenUser) => {
      if (err) { res.sendStatus(403); } else {
        req.managerEmail = tokenUser.email;
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
    if (error.message === 'Email') {
      res.status(409);
      res.send('Email');
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
    const userInfo = await getUserInfo(req.body.email);
    const verify = await verifyPassword(userInfo.password, req.body.password);
    res.locals.isOneTimePassword = userInfo.isOneTimePassword;
    res.locals.passwordExpirationDate = userInfo.passwordExpirationDate;
    res.locals.role = userInfo.role;
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
  res.cookie('token', token, { httpOnly: true, maxAge: 900000 });
  // Create cookie with session info: user's email and role
  res.cookie('user', JSON.stringify({ email: req.body.email, role: res.locals.role }), { maxAge: 900000, encode: (str) => str });
  res.send({
    isOneTimePassword: res.locals.isOneTimePassword,
    passwordExpirationDate: res.locals.passwordExpirationDate,
    role: res.locals.role,
  });
  res.end();
});

userRouter.post('/logout', (req, res) => {
  console.log('Received Post request.');
  res.clearCookie('token');
  res.clearCookie('user');
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
