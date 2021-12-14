/* eslint-disable max-len */
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import config from './config.js';
import localConfig from './localConfig.js';

const { Schema, model } = mongoose;

const emailValidate = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    httpStatus: 400,
  }),
];

// setter function
const toLower = (v) => v.toLowerCase();

const userSchema = new Schema({
  email: {
    type: String, unique: true, default: null, set: toLower, validate: emailValidate, index: { unique: true },
  },
  password: { type: String },
  role: {
    type: String,
    default: 'Basic',
    enum: ['Basic', 'Employee', 'Admin'],
  },
  tickets: [{
    title: { type: String, required: true, default: 'anonymous' },
    description: { type: String, required: true, default: 'anonymous' },
    category: { type: String, required: true, default: 'anonymous' },
    priority: {
      type: String, required: true, default: 'Low',
    },
    urgency: {
      type: String, required: true, default: 'Low',
    },
    date: { type: Date, default: Date.now },
  }],
});

// exporting userSchema to the user collection
const User = model('User', userSchema, 'users');

// const guestUserSchema = new Schema({
//   tickets: [{
//     email: { type: String, required: true },
//     title: { type: String, required: true, default: 'anonymous' },
//     description: { type: String, required: true, default: 'anonymous' },
//     category: { type: String, required: true, default: 'anonymous' },
//     priority: {
//       type: Number, required: true, min: 0, max: 10,
//     },
//     urgency: {
//       type: Number, required: true, min: 0, max: 10, index: true,
//     },
//     date: { type: Date, default: Date.now },
//   }],
// });

// const GuestUser = model('GuestUser', guestUserSchema, 'users');

// const comment1 = new userModel({
//   title: 'help',
//   description: 'there is a problem',
//   priority: '5',
//   urgency: '10',
// });

// comment1.save((err, comment) => {
//   if (err) console.log(err);
//   else console.log('fallowing comment was saved:', comment);
// });

const uri = `mongodb+srv://${localConfig.mongodb.username}:${localConfig.mongodb.password}@${config.mongodb.cluster}/${config.mongodb.database}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const createTicket = async (userEmail, ticket) => {
  try {
    await mongoose.connect(uri);
    const result = User.updateOne({ email: userEmail }, { $push: { tickets: ticket } });
    return result;
  } finally {
    await client.close();
  }
};

export const getTicketCollection = async (userEmail) => {
  try {
    await mongoose.connect(uri);
    const result = await User.findOne({ email: userEmail }, 'tickets').exec();
    return result.tickets;
  } finally {
    await client.close();
  }
};

export const createUser = async (userEmail, userPassword) => {
  try {
    await mongoose.connect(uri);
    // a document instance of user
    const user1 = new User({ email: userEmail, password: userPassword, tickets: [] });

    // save model to database
    user1.save((err, user) => {
      if (err) console.error(err);
      console.log(`${user.name} saved to user collection.`);
    });
  } finally {
    await client.close();
  }
};

export const getPassword = async (userEmail) => {
  try {
    await mongoose.connect(uri);

    const result = await User.findOne({ email: userEmail }, 'password').exec();
    return result.password;
  } finally {
    await client.close();
  }
};

const connectDatabase = async (req, res) => {
  try {
    await mongoose.connect(config.mongodb);
  } catch (error) {
    res.status(500);
  }
};

/*

const createTickets = async (tickets) => {
  try {
    await client.connect();

    const result = await client.db(config.mongodb.database).collection('tickets').insertMany(tickets);

    return result;
  } finally {
    await client.close();
  }
};

const deleteAllTickets = async () => {
  try {
    await client.connect();

    const result = await client.db(config.mongodb.database).collection('tickets').deleteMany({});

    return result;
  } finally {
    await client.close();
  }
};

*/

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
