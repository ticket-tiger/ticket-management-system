import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CreatePermanentPassword.css';

const CreatePermanentPassword = ({ closeModal }) => {
  const [passwordChangeStatusCSSClass, setPasswordChangeStatusCSSClass] = useState('');
  // const [newPassword, setNewPassword] = useState('');

  const initialCredentials = {
    password: '',
    verificationPassword: '',
  };

  const passwordReducer = (state, action) => {
    switch (action.type) {
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

  const [credentials, dispatch] = useReducer(passwordReducer, initialCredentials);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.verificationPassword) {
      // Handle error
      console.log('Passwords don\'t match');
    }
    try {
      await axios.post('/users/create-permanent-password', { newPassword: credentials.password });
      closeModal();
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 500) setPasswordChangeStatusCSSClass('status-500');
        else setPasswordChangeStatusCSSClass('status-default-error');
      } else setPasswordChangeStatusCSSClass('status-default-error');
    }
  };

  return (
    <>
      <div className="error-message-group">
        {passwordChangeStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience.</p> : null}
        {passwordChangeStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      </div>
      <h1 className="permanent-password-heading">Please create a permanent password</h1>
      <form>
        <div className="permanent-password-form-input-group">
          <input
            id="newPassword"
            className={`permanent-password-form-input ${passwordChangeStatusCSSClass}`}
            type="password"
            onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
          />
          <label className="permanent-password-form-label" htmlFor="newPassword">New Password</label>
          <input
            id="newVerificationPassword"
            className={`permanent-password-form-input ${passwordChangeStatusCSSClass}`}
            type="password"
            onChange={(e) => dispatch({ type: 'verificationPassword', payload: e.target.value })}
          />
          <label className="permanent-password-form-label" htmlFor="newVerificationPassword">Confirm Password</label>
        </div>
        <button type="submit" className="permanent-password-submit-button" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </>
  );
};

CreatePermanentPassword.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreatePermanentPassword;
