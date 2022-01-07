import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import validator from 'validator';
import './CreateEmployee.css';

const CreateEmployee = ({ closeModal }) => {
  // const [accountCreationSuccessful, setAccountCreationSuccessful] = useState(false);
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');
  const [errorCSSClass, setErrorCSSClass] = useState('');

  const initialEmployee = { email: '', type: '' };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'email':
        return {
          ...state,
          email: action.payload,
        };
      case 'type':
        return {
          ...state,
          type: action.payload,
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
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith('Bearer '));

        const config = {
          headers: {
            authorization: cookieValue || null,
          },
        };

        await axios.post('/users/create-employee', employee, config);
        closeModal();
        // setAccountCreationSuccessful(true);
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
      {/* <h2 className="create-employee-heading">Create an account with us</h2> */}
      <form>
        <div className="create-employee-form-input-group">
          <input
            id="create-employee-form-email"
            onChange={(e) => dispatch({ type: 'email', payload: e.target.value })}
            className={`create-employee-form-input ${accountCreationStatusCSSClass} ${errorCSSClass}`}
          />
          <label className="create-employee-form-label" type="text" htmlFor="create-employee-form-email">Employee Email</label>
          <select id="employee-type-dropdown" className="create-employee-form-dropdown" onChange={(e) => dispatch({ type: 'type', payload: e.target.value })}>
            <option value="Engineer">Engineer</option>
            <option value="Manager">Manager</option>
          </select>
          <label className="create-employee-form-label" type="text" htmlFor="create-employee-form-employee-type">Employee Type</label>
        </div>
        <button className="create-employee-submit-button" type="submit" onClick={(e) => handleSubmit(e)}>Create Account</button>
      </form>
    </>
  );
};

CreateEmployee.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateEmployee;
