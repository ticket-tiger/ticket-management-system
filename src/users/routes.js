import express from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
// import localConfig from '../localConfig.js';
import { hashPassword, verifyPassword } from './argon2.js';
import {
  createUser,
  createEmployee,
  createPermanentPassword, getLoginUserInfo, updateOneTimePassword, getOneTimeEmployees,
} from '../db.js';
import { sendOneTimePasswordByEmail } from './email.js';

const userRouter = express.Router();

const generateAccessTokens = (email) => jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '900s' });

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (token === undefined) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, { maxAge: '900s' }, (err, tokenUser) => {
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
      sendOneTimePasswordByEmail(req.body.name, req.body.email, tempPassword);
      res.send(result);
    } else res.sendStatus(403);
  } catch (error) {
    if (error.message === 'User already exists') res.sendStatus(409);
    else res.sendStatus(500);
  }
  res.end();
});

userRouter.post('/login', async (req, res, next) => {
  console.log('Received POST request.');
  try {
    const userInfo = await getLoginUserInfo(req.body.email);
    // Check if the result is not null, i.e. the email exists in the db.
    if (userInfo) {
      if (userInfo.password) {
        if (await verifyPassword(userInfo.password, req.body.password)) {
          res.status(200);
          res.locals.isOneTimePassword = userInfo.isOneTimePassword;
          res.locals.passwordExpirationDate = userInfo.passwordExpirationDate;
          res.locals.role = userInfo.role;
          next();
        } else {
          res.status(401);
          res.send('Invalid password');
          res.end();
        }
      } else {
        res.status(401);
        res.send('Guest account');
        res.end();
      }
    } else {
      res.status(401);
      res.send('Invalid email');
      res.end();
    }
  } catch (error) {
    res.status(500);
    res.send('Server error');
    res.end();
  }
}, (req, res, next) => {
  // Check if one-time password has expired
  const formattedPasswordExpirationDate = Date.parse(new Date(res.locals.passwordExpirationDate));
  if (formattedPasswordExpirationDate < Date.now()) {
    res.status(403);
    res.send('Password expired');
    res.end();
  } else next();
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

userRouter.get('/get-one-time-employees', verifyToken, async (req, res) => {
  console.log('Received GET request.');
  try {
    const result = await getOneTimeEmployees();
    res.send(result);
  } catch (error) {
    res.sendStatus(500);
  }
});

userRouter.post('/resend-one-time-password', verifyToken, async (req, res) => {
  console.log('Received POST request');
  try {
    const tempPassword = randomBytes(10).toString('hex');
    const hashedTempPassword = await hashPassword(tempPassword);
    const result = await updateOneTimePassword(req.body.email, hashedTempPassword);
    await sendOneTimePasswordByEmail(req.body.name, req.body.email, tempPassword);
    res.send(result);
  } catch (error) {
    res.sendStatus(500);
    res.end();
  }
});

export default userRouter;
