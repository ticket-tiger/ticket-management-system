import React, { useReducer, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
// import axios from 'axios';
import './CreateAccount.css';

const CreateAccount = () => {
  const [accountCreationSuccessful, setAccountCreationSuccessful] = useState(false);
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');

  const initialCredentials = {
    email: '',
    password: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'email':
        return {
          ...state,
          email: action.payload,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_USERS_URL}/create-account`, credentials);
      setAccountCreationSuccessful(true);
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
      else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
      else setAccountCreationStatusCSSClass('status-default-error');
    }
  };

  if (accountCreationSuccessful) {
    return <Navigate to="/Login" />;
  }

  return (
    <>
      {accountCreationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
      {accountCreationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience</p> : null}
      {accountCreationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      <h1>Create an account with us</h1>
      <form>
        <div className="create-account-form-input-group">
          <label className="create-account-form-label" type="text" htmlFor="create-account-form-username">Email</label>
          <input
            id="create-account-form-username"
            onChange={(e) => dispatch({ type: 'email', payload: e.target.value })}
            className={`create-account-form-input ${accountCreationStatusCSSClass}`}
          />
          <label className="create-account-form-label" type="text" htmlFor="create-account-form-password">Password</label>
          <input
            type="password"
            id="create-account-form-password"
            onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
            className={`create-account-form-input ${accountCreationStatusCSSClass}`}
          />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </>
  );
};

export default CreateAccount;
