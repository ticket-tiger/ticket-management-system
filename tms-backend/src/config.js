const config = {};

config.express = {
  port: process.env.EXPRESS_PORT || 3001,
  ip: '127.0.0.1',
};

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost',
  cluster: process.env.MONGODB_CLUSTER || 'devconnector.6uznf.mongodb.net',
  database: process.env.MONGODB_DATABASE || 'tms',
};

export default config;
