import express from 'express';
import config from './config.js';
import ticketsRouter from './tickets/routes.js';
import run from './db.js';

const app = express();

app.use('/api', ticketsRouter);

app.listen(config.express.port, config.express.ip, () => {
  console.log(`Server is listening on port ${config.express.port}`);
});

run().catch(console.dir);
