/* eslint-disable max-len */
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import validate from 'mongoose-validator';
// import config from './config.js';
// import localConfig from './localConfig.js';

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
    passIfEmpty: true,
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
    type: String, default: null, validate: nameValidate, required: false,
  },
  password: {
    type: String, required: false,
  },
  isOneTimePassword: { type: Boolean, required: false },
  passwordExpirationDate: { type: Date, required: false },
  role: {
    type: String,
    default: 'Basic',
    enum: ['Basic', 'Engineer', 'Manager', 'Admin'],
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

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const createTicket = async (userEmail, ticket) => {
  try {
    await mongoose.connect(uri);
    // Create user if they don't exist.
    if (!await User.findOne({ email: userEmail })) {
      const user1 = new User({
        email: userEmail, role: 'Basic', tickets: [],
      });
      await user1.save();
    }
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
      result = await User.find({}, { _id: 0, tickets: 1 }).exec();
      let tickets = [];
      result.forEach((ticketsObject) => {
        tickets = tickets.concat(ticketsObject.tickets);
      });
      result.tickets = tickets;
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

export const deleteTicket = async (email, _id) => {
  try {
    await mongoose.connect(uri);
    const result = await User.updateOne({ email }, {
      $pull: {
        tickets: { _id },
      },
    });
    return result;
  } finally {
    client.close();
  }
};

export const createUser = async (userEmail, userName, userPassword) => {
  try {
    await mongoose.connect(uri);
    let result;
    // If the user doesn't exist...
    if (!await User.findOne({ email: userEmail })) {
      // Create a new user
      const user1 = new User({
        email: userEmail, name: userName, password: userPassword, tickets: [],
      });
      result = await user1.save();
    // If the user exists as a 'guest'...
    } else if (!await User.findOne({ email: userEmail, password: { $exists: true } })) {
      // Add name and password properties to their document
      result = await User.updateOne({ email: userEmail }, {
        $set: {
          password: userPassword,
          name: userName,
        },
      });
    } else throw new Error('Email');
    return result;
  } finally {
    await client.close();
  }
};

export const createEmployee = async (employeeObject, oneTimePassword) => {
  const expirationDate = Date.now() + 6.048e+8;
  try {
    await mongoose.connect(uri);
    const existingEmployee = await User.findOne({ email: employeeObject.email });
    if (existingEmployee) {
      throw new Error('User already exists');
    }
    const newEmployee = new User({
      name: employeeObject.name,
      email: employeeObject.email,
      password: oneTimePassword,
      isOneTimePassword: true,
      passwordExpirationDate: expirationDate,
      role: employeeObject.role,
      tickets: [],
    });
    newEmployee.save((err, user) => {
      if (err) console.log(err);
      console.log(`${user.email} saved to user collection.`);
    });
  } finally {
    await client.close();
  }
};

export const updateOneTimePassword = async (email, oneTimePassword) => {
  const expirationDate = Date.now() + 6.048e+8;
  try {
    await mongoose.connect(uri);
    await User.updateOne({ email }, { password: oneTimePassword, passwordExpirationDate: expirationDate });
  } finally {
    await client.close();
  }
};

export const createPermanentPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(uri);
    // const userObject = await User.findOne({ email }, 'passwordExpirationDate');
    // const passwordExpirationDate = Date.parse(new Date(userObject.passwordExpirationDate));
    // if (passwordExpirationDate >= Date.now()) {
    const result = await User.updateOne({ email }, { password: newPassword, isOneTimePassword: false, $unset: { passwordExpirationDate: '' } });
    return result;
    // }
    // throw new Error('Expired');
  } finally {
    await client.close();
  }
};

export const getLoginUserInfo = async (userEmail) => {
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
    const result = await User.findOne({ email, 'tickets._id': objectId }, { 'tickets.$': 1, name: 1 }).exec();
    return {
      status: result.tickets[0].status, title: result.tickets[0].title, email: result.tickets[0].email, name: result.name,
    };
  } finally {
    await client.close();
  }
};

export const getOneTimeEmployees = async () => {
  try {
    await mongoose.connect(uri);
    const result = await User.find({ role: { $in: ['Engineer', 'Manager'] }, isOneTimePassword: true }, 'email name').exec();
    return result;
  } finally {
    await client.close();
  }
};
