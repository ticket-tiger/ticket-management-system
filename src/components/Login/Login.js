import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import CreatePermanentPassword from '../CreatePermanentPassword/CreatePermanentPassword';
import './Login.css';
import { useAuth } from '../../auth';

const Login = ({ hideTabs, closeModal }) => {
  const [authenticationStatusCSSClass, setAuthenticationStatusCSSClass] = useState('');
  const [isOneTimePassword, setIsOneTimePassword] = useState(false);

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

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/login', credentials);
      setAuthenticationStatusCSSClass('200-status');
      document.cookie = `Bearer ${response.data.token}`;
      auth.signin(credentials.email);
      setIsOneTimePassword(response.data.isOneTimePassword);
      if (!response.data.isOneTimePassword) closeModal();
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) setAuthenticationStatusCSSClass('status-400');
        else if (error.response.status >= 500) setAuthenticationStatusCSSClass('status-500');
        else setAuthenticationStatusCSSClass('status-default-error');
      } else setAuthenticationStatusCSSClass('status-default-error');
    }
  };

  if (isOneTimePassword) {
    hideTabs(true);
    return <CreatePermanentPassword closeModal={closeModal} />;
  }

  if (auth.email) {
    return <Navigate to="/create-ticket" />;
  }

  return (
    <>
      {/* <Link to="/create-ticket">
        <button type="button">
          Continue As Guest
        </button>
      </Link> */}
      <div className="error-message-group">
        {authenticationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
        {authenticationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience.</p> : null}
        {authenticationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      </div>
      <form>
        <div className="login-form-input-group">
          <div>
            <input
              type="text"
              className={`login-form-input ${authenticationStatusCSSClass}`}
              id="login-form-email"
              value={credentials.username}
              onChange={(e) => dispatch({ type: 'email', payload: e.target.value })}
            />
            <label className="login-form-label" htmlFor="login-form-email">Email</label>
          </div>
          <div>
            <input
              type="password"
              className={`login-form-input ${authenticationStatusCSSClass}`}
              id="login-form-password"
              value={credentials.passsword}
              onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
            />
            <label className="login-form-label" htmlFor="login-form-password">Password</label>
          </div>
        </div>
        <button type="submit" className="login-submit-button" onClick={(e) => handleSubmit(e)}>
          Log In
        </button>
      </form>
    </>
  );
};

Login.propTypes = {
  hideTabs: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Login;
