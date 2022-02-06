import React, { useState, useReducer } from 'react';
import axios from 'axios';
import validator from 'validator';
import './CreateEmployee.css';

const CreateEmployee = () => {
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');
  const [errorCSSClass, setErrorCSSClass] = useState('');

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
        await axios.post('/users/create-employee', employee);
      } catch (error) {
        if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
        else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
        else setAccountCreationStatusCSSClass('status-default-error');
      }
    }
  };

  return (
    <>
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
