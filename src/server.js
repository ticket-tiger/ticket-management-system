import express from 'express';
import config from './config.js';
import ticketsRouter from './tickets/routes.js';

const app = express();

app.use('/api', ticketsRouter);

app.listen(config.express.port, config.express.ip, () => {
  console.log(`Server is listening on port ${config.express.port}`);
});
