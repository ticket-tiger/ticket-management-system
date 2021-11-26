import React, { useReducer } from 'react';
import { Navigate } from 'react-router-dom';
// import axios from 'axios';
import './Login.css';
import { useAuth } from '../../auth';

const Login = () => {
  const initialCredentials = {
    username: '',
    password: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
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
    auth.signin(credentials.username);
  };

  if (auth.user) {
    return <Navigate to="/employee" />;
  }
  if (auth.user === '') {
    return <Navigate to="/user" />;
  }

  return (
    <>
      <form>
        <label htmlFor="login-form-username">Username</label>
        <input type="text" id="login-form-username" value={credentials.username} onChange={(e) => dispatch({ type: 'username', payload: e.target.value })} />
        <label htmlFor="login-form-password">Password</label>
        <input type="password" id="login-form-password" value={credentials.passsword} onChange={(e) => dispatch({ type: 'password', payload: e.target.value })} />
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </>
  );
};

export default Login;
