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

  const errorReducer = (state, action) => {
    switch (action.type) {
      case 409:
        return {
          ...state,
          email: 'status409',
          message: 'This email already exists',
        };
      case 500:
        return {
          ...state,
          message: 'We are having some problems, please try again',
        };
      case 'noName':
        return {
          ...state,
          message: 'Enter your name',
        };
      case 'invalidPassword':
        return {
          ...state,
          message: 'Passwords do not match, please retype',
        };
      case 'invalidEmail':
        return {
          ...state,
          message: 'Invalid Email',
        };
      case 'noError':
        return {
          email: '',
          name: '',
          password: '',
          message: '',
          verificationPassword: '',
          validEmail: '',
        };
      default:
        return {
          ...state,
          message: 'There was an unexpected error.  Please try again in a little while',
        };
    }
  };

  const initialErrorObject = {
    email: '',
    name: '',
    password: '',
    message: '',
    verificationPassword: '',
  };

  const [errorObject, errorDispatch] = useReducer(errorReducer, initialErrorObject);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validator.isEmpty(credentials.name)) {
      errorDispatch({ type: 'noName' });
      return;
    }

    if (!validator.isEmail(credentials.email)) {
      errorDispatch({ type: 'invalidEmail' });
      return;
    }

    if (credentials.password !== credentials.verificationPassword) {
      errorDispatch({ type: 'invalidPassword' });
      return;
    }

    try {
      await axios.post('/users/create-account', credentials);
      closeModal();
    } catch (error) {
      errorDispatch({ type: error.response.status });
    }
  };

  return (
    <>
      <div className="yo">
        <p className="error-message-group-1">
          {errorObject.message}
        </p>
      </div>
      {/* <h2 className="create-account-heading">Create an account with us</h2> */}
      <form>
        <div className="create-account-form-input-group">
          <div>
            <input
              id="create-account-form-username"
              onChange={(e) => credentialsDispatch({ type: 'name', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.name}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-username">Name</label>
          </div>
          <div>
            <input
              id="create-account-form-username"
              onChange={(e) => credentialsDispatch({ type: 'email', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.email}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-username">Email</label>
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
              id="create-account-form-password"
              onChange={(e) => credentialsDispatch({ type: 'verificationPassword', payload: e.target.value })}
              className={`create-account-form-input ${errorObject.verificationPassword}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-password">Retype Password</label>
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
