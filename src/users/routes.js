import express from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import localConfig from '../localConfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import {
  createUser, createEmployee, createPermanentPassword, getUserInfo, updateOneTimePassword,
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
        res.locals.managerEmail = tokenUser.email;
        res.locals.managerRole = tokenUser.role;
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

userRouter.post('/create-account', async (req, res) => {
  console.log('Received POST request.');
  const hash = await hashPassword(req.body.password);
  const account = {
    email: req.body.email,
    name: req.body.name,
    password: hash,
  };
  try {
    const result = await createUser(account.email, account.name, account.password);
    res.send(result);
  } catch (error) {
    if (error.message === 'Email') {
      res.status(409);
      res.send('Email');
    } else {
      res.sendStatus(500);
    }
  } res.end();
});

userRouter.post('/create-employee', verifyToken, async (req, res) => {
  console.log('Received POST request.');
  try {
    if (res.locals.managerRole === 'Manager') {
      const tempPassword = randomBytes(10).toString('hex');
      const hashedTempPassword = await hashPassword(tempPassword);
      const result = await createEmployee(req.body, hashedTempPassword);
      sendOneTimePasswordByEmail(req.body.email, tempPassword);
      res.send(result);
    } else res.sendStatus(403);
  } catch (error) {
    if (error.message === 'Send new password') {
      const tempPassword = randomBytes(10).toString('hex');
      const hashedTempPassword = await hashPassword(tempPassword);
      const result = await updateOneTimePassword(req.body.email, hashedTempPassword);
      sendOneTimePasswordByEmail(req.body.email, tempPassword);
      res.send(result);
    } else if (error.message === 'Has permanent password') res.sendStatus(409);
    else res.sendStatus(500);
  }
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
    res.sendStatus(500);
    res.end();
  }
}, (req, res) => {
  // Tokens expire after 15 minutes (900000ms)
  const token = generateAccessTokens({ email: req.body.email, role: res.locals.role });
  res.cookie('token', token, { httpOnly: true, maxAge: 900000 });
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
  try {
    const hashedPassword = await hashPassword(req.body.newPassword);
    const result = await createPermanentPassword(res.locals.managerEmail, hashedPassword);
    res.send(result);
  } catch (error) {
    res.sendStatus(403);
  }
  res.end();
});

export default userRouter;
