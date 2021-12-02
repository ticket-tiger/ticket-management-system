/* eslint-disable max-len */
import { MongoClient } from 'mongodb';
import config from './config.js';
import localConfig from './localConfig.js';

const uri = `mongodb+srv://${localConfig.mongodb.username}:${localConfig.mongodb.password}@${config.mongodb.cluster}/${config.mongodb.database}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const createTicket = async (ticket) => {
  try {
    await client.connect();

    const result = await client.db(config.mongodb.database).collection('tickets').insertOne(ticket);

    return result;
  } finally {
    await client.close();
  }
};

export const getTicketCollection = async () => {
  try {
    await client.connect();

    const result = await client.db(config.mongodb.database).collection('tickets').find().toArray();

    return result;
  } finally {
    await client.close();
  }
};

// const createTickets = async (tickets) => {
//   try {
//     await client.connect();

//     const result = await client.db(config.mongodb.database).collection('tickets').insertMany(tickets);

//     return result;
//   } finally {
//     await client.close();
//   }
// };

// const deleteAllTickets = async () => {
//   try {
//     await client.connect();

//     const result = await client.db(config.mongodb.database).collection('tickets').deleteMany({});

//     return result;
//   } finally {
//     await client.close();
//   }
// };

// const tickets = [
//   {
//     category: 'category1',
//     title: 'test1',
//     description: 'The login button doesn\x27t work.',
//     priority: 'Low',
//     urgency: 'High',
//     dateCreated: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
//   },
//   {
//     category: 'category2',
//     title: 'test2',
//     description: 'The screen freezes when I run a file called malware.exe.',
//     priority: 'Medium',
//     urgency: 'Medium',
//     dateCreated: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
//   },
//   {
//     category: 'category3',
//     title: 'test3',
//     description: 'I received bad customer service the last time I called you.',
//     priority: 'High',
//     urgency: 'Low',
//     dateCreated: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
//   }];

// const testDB = async () => {
//   await deleteAllTickets().catch(console.dir);
//   await createTickets(tickets).catch(console.dir);
//   const returnedTickets = await getTicketCollection().catch(console.dir);
//   console.log(returnedTickets);
// };

// testDB();
