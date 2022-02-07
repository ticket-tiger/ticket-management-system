import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// import config from './config.js';
import ticketsRouter from './tickets/routes.js';
import userRouter from './users/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/tickets', ticketsRouter);
app.use('/users', userRouter);
app.listen(process.env.EXPRESS_PORT, process.env.EXPRESS_IP, () => {
  console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});
