import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth';
// import axios from 'axios';
import './CreateAccount.css';

const CreateAccount = (props) => {
  const { submitForm, closeForm } = props;

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
    auth.signin(credentials.username);
    submitForm();
    // try {
    //   const response = await axios.post(`${process.env.REACT_APP_API_URL}
    // /create-account`, credentials, {
    //     headers: {
    //       Authorization: `Basic ${credentials.username}:${credentials.password}`,
    //     },
    //   });
    //   return response.status;
    // } catch (error) {
    //   return error.response.status;
    // }
  };

  if (auth.user) {
    return <Navigate to="/employee" />;
  }
  if (auth.user === '') {
    return <Navigate to="/user" />;
  }

  return (
    <>
      <h1>Create an account with us</h1>
      <form>
        <label type="text" htmlFor="create-account-form-name">Name</label>
        <input id="create-account-form-name" onChange={(e) => dispatch({ type: 'name', payload: e.target.value })} />
        <label type="text" htmlFor="create-account-form-username">Username</label>
        <input id="create-account-form-username" onChange={(e) => dispatch({ type: 'username', payload: e.target.value })} />
        <label htmlFor="create-account-form-password">Password</label>
        <input type="password" id="create-account-form-password" onChange={(e) => dispatch({ type: 'password', payload: e.target.value })} />
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
