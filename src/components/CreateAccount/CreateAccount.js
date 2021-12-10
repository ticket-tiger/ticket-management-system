import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth';
// import axios from 'axios';
import './CreateAccount.css';

const CreateAccount = (props) => {
  const { submitForm, closeForm } = props;

  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');

  const initialCredentials = {
    name: '',
    username: '',
    password: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return {
          ...state,
          name: action.payload,
        };
      case 'username':
        return {
          ...state,
          username: action.payload,
        };
      case 'password':
        return {
          ...state,
          password: action.payload,
        };
      default:
        return state;
    }
  };

  const [credentials, dispatch] = useReducer(reducer, initialCredentials);

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/create-account`, credentials);
      auth.signin(credentials.username);
      submitForm();
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
      else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
      else setAccountCreationStatusCSSClass('status-default-error');
    }
  };

  if (auth.user) {
    return <Navigate to="/employee" />;
  }
  if (auth.user === '') {
    return <Navigate to="/user" />;
  }

  return (
    <>
      {accountCreationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
      {accountCreationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience</p> : null}
      {accountCreationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      <h1>Create an account with us</h1>
      <form>
        <label type="text" htmlFor="create-account-form-name">Name</label>
        <input
          id="create-account-form-name"
          onChange={(e) => dispatch({ type: 'name', payload: e.target.value })}
          className={accountCreationStatusCSSClass}
        />
        <label type="text" htmlFor="create-account-form-username">Username</label>
        <input
          id="create-account-form-username"
          onChange={(e) => dispatch({ type: 'username', payload: e.target.value })}
          className={accountCreationStatusCSSClass}
        />
        <label htmlFor="create-account-form-password">Password</label>
        <input
          type="password"
          id="create-account-form-password"
          onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
          className={accountCreationStatusCSSClass}
        />
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
        <button type="button" onClick={closeForm}>Close</button>
      </form>
    </>
  );
};

CreateAccount.propTypes = {
  submitForm: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default CreateAccount;
