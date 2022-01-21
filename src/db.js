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
    message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters',
    httpStatus: 400,
  }),
];

const nameValidate = [
  validate({
    validator: 'isLength',
    arguments: [1, 45],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    httpStatus: 400,
  }),
];

// setter function to make all emails lowercase
const toLower = (v) => v.toLowerCase();

const userSchema = new Schema({
  email: {
    type: String, unique: true, default: null, set: toLower, validate: emailValidate, index: { unique: true },
  },
  name: {
    type: String, default: null, validate: nameValidate,
  },
  password: {
    type: String,
  },
  isOneTimePassword: { type: Boolean, required: false },
  passwordExpirationDate: { type: Date, required: false },
  role: {
    type: String,
    default: 'Basic',
    enum: ['Basic', 'Employee', 'Manager', 'Admin'],
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
    status: {
      type: String,
      default: 'Submitted',
      enum: ['Submitted', 'In Progress', 'Resolved'],
    },
    email: {
      type: String, required: true, set: toLower, validate: emailValidate,
    },
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

export const getTickets = async (userEmail, userRole) => {
  try {
    await mongoose.connect(uri);
    let result;
    if (userRole === 'Engineer' || userRole === 'Manager') {
      // Grab all tickets
      result = await User.find({}, 'tickets').exec();
    } else {
      result = await User.findOne({ email: userEmail }, 'tickets').exec();
    }
    return result.tickets;
  } finally {
    await client.close();
  }
};

export const updateTicket = async (userEmail, ticketId, updatedFieldsObject) => {
  try {
    await mongoose.connect(uri);
    const formattedUpdatedFields = {};
    Object.entries(updatedFieldsObject).forEach(([key, value]) => {
      formattedUpdatedFields[`tickets.$.${key}`] = value;
    });
    const result = await User.updateOne({ email: userEmail, 'tickets._id': ticketId }, {
      $set: formattedUpdatedFields,
    });
    return result;
  } finally {
    await client.close();
  }
};

export const createUser = async (userEmail, userName, userPassword) => {
  try {
    await mongoose.connect(uri);
    // a document instance of user
    const user1 = new User({
      email: userEmail, name: userName, password: userPassword, tickets: [],
    });
    // save model to database
    const result = await user1.save();
    return result;
  } catch (error) {
    console.log(error);
    // return error.code;
    throw error;
  } finally {
    await client.close();
  }
};

export const createEmployee = async (managerEmail, employeeObject, oneTimePassword) => {
  const expirationDate = Date.now() + 6.048e+8;
  try {
    await mongoose.connect(uri);
    const userObject = await User.findOne({ email: managerEmail }, 'role').exec();
    if (userObject.role === 'Manager') {
      const newEmployee = new User({
        email: employeeObject.email,
        password: oneTimePassword,
        isOneTimePassword: true,
        passwordExpirationDate: expirationDate,
        role: employeeObject.type,
        tickets: [],
      });
      newEmployee.save((err, user) => {
        if (err) console.log(err);
        console.log(`${user.email} saved to user collection.`);
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

export const createPermanentPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(uri);
    const userObject = await User.findOne({ email }, 'passwordExpirationDate');
    const passwordExpirationDate = Date.parse(Date(userObject.passwordExpirationDate));
    console.log(passwordExpirationDate);
    console.log(Date.now());
    if (passwordExpirationDate <= Date.now()) {
      const result = await User.updateOne({ email }, { password: newPassword, isOneTimePassword: false, $unset: { passwordExpirationDate: '' } });
      return result;
    }
    throw new Error('Your one-time password has expired. Please request a new one to be issued.');
  } finally {
    await client.close();
  }
};

export const getUserInfo = async (userEmail) => {
  try {
    await mongoose.connect(uri);
    const result = await User.findOne({ email: userEmail }, 'password isOneTimePassword passwordExpirationDate role').exec();
    return result;
  } finally {
    await client.close();
  }
};

export const getCurrentStatusTitleEmail = async (email, objectId) => {
  try {
    await mongoose.connect(uri);
    // We can probably search for the user by email instead of an id of a ticket
    const result = await User.findOne({ email, 'tickets._id': objectId }, { 'tickets.$': 1 }).exec();
    return { status: result.tickets[0].status, title: result.tickets[0].title, email: result.tickets[0].email };
  } finally {
    await client.close();
  }
};

// const connectDatabase = async (req, res) => {
//   try {
//     await mongoose.connect(config.mongodb);
//   } catch (error) {
//     res.status(500);
//   }
// };
