import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// import axios from 'axios';
import './CreateAccount.css';

const CreateAccount = ({ closeModal }) => {
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
      await axios.post('/users/create-account', credentials);
      closeModal();
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
      else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
      else setAccountCreationStatusCSSClass('status-default-error');
    }
  };

  return (
    <>
      <div className="error-message-group">
        {accountCreationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
        {accountCreationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience.</p> : null}
        {accountCreationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      </div>
      {/* <h2 className="create-account-heading">Create an account with us</h2> */}
      <form>
        <div className="create-account-form-input-group">
          <div>
            <input
              id="create-account-form-username"
              onChange={(e) => dispatch({ type: 'email', payload: e.target.value })}
              className={`create-account-form-input ${accountCreationStatusCSSClass}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-username">Email</label>
          </div>
          <div>
            <input
              type="password"
              id="create-account-form-password"
              onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
              className={`create-account-form-input ${accountCreationStatusCSSClass}`}
            />
            <label className="create-account-form-label" type="text" htmlFor="create-account-form-password">Password</label>
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
