import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CreateAccount.css';
import validator from 'validator';
// import { act } from 'react-test-renderer';

const CreateAccount = ({ closeModal }) => {
  const initialCredentials = {
    email: '',
    name: '',
    password: '',
  };

  // To manage state of new account fields
  const emailReducer = (state, action) => {
    switch (action.type) {
      case 'email':
        return {
          ...state,
          email: action.payload,
        };
      case 'name':
        return {
          ...state,
          name: action.payload,
        };
      case 'password':
        return {
          ...state,
          password: action.payload,
        };
      case 'verificationPassword':
        return {
          ...state,
          verificationPassword: action.payload,
        };
      default:
        return state;
    }
  };

  const [credentials, credentialsDispatch] = useReducer(emailReducer, initialCredentials);

  // To manage state of error messages and css classes
  const errorReducer = (state, action) => {
    switch (action.type) {
      case 409:
        return {
          ...state,
          email: action.valid ? '' : 'status409',
          message: action.valid ? state.message : 'This email already exists',
        };
      case 500:
        return {
          ...state,
          email: action.valid ? '' : 'status500',
          message: action.valid ? state.message : 'We are having some problems, please try again',
        };
      case 'Name':
        return {
          ...state,
          name: action.valid ? '' : 'noName',
          message: action.valid ? state.message : 'Enter your name',
        };
      case 'Password':
        return {
          ...state,
          password: action.valid ? '' : 'invalidPassword',
          message: action.valid ? state.message : 'Passwords do not match, please retype',
        };
      case 'passwordLength':
        return {
          ...state,
          password: action.valid ? '' : 'passwordLength',
          verifyPassword: action.valid ? '' : 'passwordLength',
          message: action.valid ? state.message : 'Use 8 characters or more for your password',
        };
      case 'Email':
        return {
          ...state,
          email: action.valid ? '' : 'invalidEmail',
          message: action.valid ? state.message : 'Invalid Email',
        };
      case 'noError':
        return {
          name: '',
          email: '',
          password: '',
          varifyPassword: '',
          message: '',
        };
      default:
        return {
          ...state,
          message: 'There was an unexpected error.  Please try again in a little while',
        };
    }
  };

  const initialErrorObject = {
    name: '',
    email: '',
    password: '',
    varifyPassword: '',
    message: [],

  };

  const [errorObject, errorDispatch] = useReducer(errorReducer, initialErrorObject);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate each field before http request is sent

    if (validator.isEmpty(credentials.name)) {
      errorDispatch({ type: 'Name', valid: false });
      return;
    }
    errorDispatch({ type: 'Name', valid: true });

    if (!validator.isEmail(credentials.email)) {
      errorDispatch({ type: 'Email', valid: false });
      return;
    }
    errorDispatch({ type: 'Email', valid: true });

    if (credentials.password.length < 8) {
      errorDispatch({ type: 'passwordLength', valid: false });
      return;
    }
    errorDispatch({ type: 'passwordLength', valid: true });

    if (credentials.password !== credentials.verificationPassword) {
      errorDispatch({ type: 'Password', valid: false });
      return;
    }
    errorDispatch({ type: 'Password', valid: true });

    try {
      const response = await axios.post('/users/create-account', credentials);
      closeModal(response.status);
    } catch (error) {
      errorDispatch({ type: error.response.status, valid: false });
    }
  };

  return (
    <>
      <p className="error-message">
        {errorObject.message}
      </p>

      <form>
        <div className="create-account-form-input-group">
          <div>
            <input
              id="create-account-form-name"
              onChange={(e) => credentialsDispatch({ type: 'name', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.name}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-name">Name</label>
          </div>
          <div>
            <input
              id="create-account-form-email"
              onChange={(e) => credentialsDispatch({ type: 'email', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.email}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-email">Email</label>
          </div>
          <div>
            <input
              type="password"
              id="create-account-form-password"
              onChange={(e) => credentialsDispatch({ type: 'password', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.password}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-password">Password</label>
          </div>
          <div>
            <input
              type="password"
              id="create-account-form-verification-password"
              onChange={(e) => credentialsDispatch({ type: 'verificationPassword', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.verifyPassword}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-verification-password">Confirm Password</label>
          </div>
        </div>
        <button className="create-account-submit-button" type="submit" onClick={(e) => handleSubmit(e)}>Create Your Account</button>
      </form>
    </>
  );
};

CreateAccount.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateAccount;
