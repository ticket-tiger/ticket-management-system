import React, { useState, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import validator from 'validator';
import './CreateEmployee.css';

const CreateEmployee = () => {
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');
  const [errorCSSClass, setErrorCSSClass] = useState('');
  const [responseStatus, setResponseStatus] = useState('');

  const initialEmployee = { name: '', email: '', role: '' };
  // To manage state of new employee fields
  const reducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return {
          ...state,
          name: action.payload,
        };
      case 'email':
        return {
          ...state,
          email: action.payload,
        };
      case 'role':
        return {
          ...state,
          role: action.payload,
        };
      default:
        return state;
    }
  };

  const [employee, dispatch] = useReducer(reducer, initialEmployee);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(employee.email)) {
      setErrorCSSClass('invalid-email');
    } else {
      try {
        const response = await axios.post('/users/create-employee', employee);
        setResponseStatus(response.status);
      } catch (error) {
        if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
        else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
        else setAccountCreationStatusCSSClass('status-default-error');
      }
    }
  };

  return (
    <>
      <div
        className={`employee-created-feedback ${responseStatus === 200 ? 'fade' : ''}`}
        onAnimationEnd={() => setResponseStatus('')}
      >
        <FontAwesomeIcon className="employee-created-check" icon={faCheck} size="2x" />
        <p className="employee-created-text">One-Time Password Sent</p>
      </div>
      <div className="error-message-group">
        {accountCreationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
        {accountCreationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience.</p> : null}
        {accountCreationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
        {errorCSSClass === 'invalid-email' ? <p>The email you entered is invalid.  Please try again.</p> : null}
      </div>
      <form>
        <div className="create-employee-form-input-group">
          <input
            id="create-employee-form-name"
            onChange={(e) => dispatch({ type: 'name', payload: e.target.value })}
            className={`create-employee-form-input ${accountCreationStatusCSSClass} ${errorCSSClass}`}
            placeholder="Name"
          />
          {/* <label className="create-employee-form-label" type="text"
          htmlFor="create-employee-form-name">Employee Name</label> */}
          <input
            id="create-employee-form-email"
            onChange={(e) => dispatch({ type: 'email', payload: e.target.value })}
            className={`create-employee-form-input ${accountCreationStatusCSSClass} ${errorCSSClass}`}
            placeholder="Email"
          />
          {/* <label className="create-employee-form-label" type="text"
          htmlFor="create-employee-form-email">Employee Email</label> */}
          <select id="create-employee-form-role-dropdown" className="create-employee-form-dropdown" onChange={(e) => dispatch({ type: 'role', payload: e.target.value })} defaultValue="">
            <option value="" disabled>Role</option>
            <option value="Engineer">Engineer</option>
            <option value="Manager">Manager</option>
          </select>
          {/* <label className="create-employee-form-label" type="text"
          htmlFor="create-employee-form-role-dropdown">Employee Role</label> */}
        </div>
        <button className="create-employee-submit-button" type="submit" onClick={(e) => handleSubmit(e)}>Create</button>
      </form>
    </>
  );
};

export default CreateEmployee;
