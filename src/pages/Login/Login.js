import React, { useReducer, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Modal from '../../components/reusableComponents/Modal';
import CreateAccount from '../../components/CreateAccount/CreateAccount';
import { useAuth } from '../../auth';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authenticationStatusCSSClass, setAuthenticationStatusCSSClass] = useState('');

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
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, credentials);
      setAuthenticationStatusCSSClass('200-status');
      auth.signin(credentials.username);
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) setAuthenticationStatusCSSClass('status-400');
      else if (error.response.status >= 500) setAuthenticationStatusCSSClass('status-500');
      else setAuthenticationStatusCSSClass('status-default-error');
    }
  };

  const closeCreateAccountForm = () => {
    setIsModalOpen(false);
  };

  const submitCreateAccountForm = () => {
    closeCreateAccountForm();
  };

  if (auth.user) {
    return <Navigate to="/view-tickets" />;
  }
  if (auth.user === '') {
    return <Navigate to="/create-ticket" />;
  }

  return (
    <>
      <Link to="/create-ticket">
        <button type="button">
          Continue As Guest
        </button>
      </Link>
      {authenticationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
      {authenticationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience</p> : null}
      {authenticationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <form className="login">
              <div className="login__field">
                <i className="login__icon fas fa-user" />
                <input
                  type="text"
                  className={`login__input ${authenticationStatusCSSClass}`}
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
                  className={`login__input ${authenticationStatusCSSClass}`}
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
              Don&apos;t have an account with us?
              <button type="button" onClick={() => setIsModalOpen(true)} className="button login__signup">Sign up</button>
              {isModalOpen
                ? (
                  <Modal>
                    <CreateAccount
                      submitForm={submitCreateAccountForm}
                      closeForm={closeCreateAccountForm}
                    />
                  </Modal>
                ) : null}
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

    </>
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
