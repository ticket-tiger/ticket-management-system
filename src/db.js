import { MongoClient } from 'mongodb';
import localConfig from './localConfig.js';

const uri = `mongodb+srv://${localConfig.mongodb.username}:${localConfig.mongodb.password}@cluster0.yiifk.mongodb.net/sample_airbnb?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('Connect was successful!');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// run().catch(console.dir);

export default run;
