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
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
            <div className="login__field">
              <i className="login__icon fas fa-user" />
              <input
                type="text"
                className="login__input"
                placeholder="Username"
                id="login-form-username"
                value={credentials.username}
                onChange={(e) => dispatch({ type: 'username', payload: e.target.value })}
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock" />
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                id="login-form-password"
                value={credentials.passsword}
                onChange={(e) => dispatch({ type: 'password', payload: e.target.value })}
              />
            </div>
            <button type="button" className="button login__submit" onClick={(e) => handleSubmit(e)}>
              <span className="button__text">Log In Now</span>
              <i className="button__icon fas fa-chevron-right" />
            </button>
          </form>
          <div className="social-login">
            {/* <h3>Login via</h3>
            <div className="social-icons">
              <a href="#" className="social-login__icon fab fa-instagram" />
              <a href="#" className="social-login__icon fab fa-facebook" />
              <a href="#" className="social-login__icon fab fa-twitter" />
            </div> */}
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4" />
          <span className="screen__background__shape screen__background__shape3" />
          <span className="screen__background__shape screen__background__shape2" />
          <span className="screen__background__shape screen__background__shape1" />
        </div>
      </div>
    </div>
  //  <>
  //    <form>
  //      <label htmlFor="login-form-username">Username</label>
  //      <input type="text" id="login-form-username" value={credentials.username}
  //       onChange={(e) => dispatch({ type: 'username', payload: e.target.value })} />
  //      <label htmlFor="login-form-password">Password</label>
  //      <input type="password" id="login-form-password" value={credentials.passsword}
  //      onChange={(e) => dispatch({ type: 'password', payload: e.target.value })} />
  //      <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
  //    </form>
  //  </>
  );
};

export default Login;
