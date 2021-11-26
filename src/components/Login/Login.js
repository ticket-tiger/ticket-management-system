import React from 'react';
import './Login.css';

const Login = () => (
  <>
    <form>
      <label htmlFor="login-form-username">Username</label>
      <input type="text" id="login-form-username" />
      <label htmlFor="login-form-password">Password</label>
      <input type="password" id="login-form-password" />
      <button type="submit">Submit</button>
    </form>
  </>
);

export default Login;
