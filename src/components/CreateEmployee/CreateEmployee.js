import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import validator from 'validator';
import './CreateEmployee.css';

const CreateEmployee = ({ closeModal }) => {
  // const [accountCreationSuccessful, setAccountCreationSuccessful] = useState(false);
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');
  const [errorCSSClass, setErrorCSSClass] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(employeeEmail)) {
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

        await axios.post('/users/create-employee', { employeeEmail }, config);
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
            id="create-employee-form-username"
            onChange={(e) => setEmployeeEmail(e.target.value)}
            className={`create-employee-form-input ${accountCreationStatusCSSClass} ${errorCSSClass}`}
          />
          <label className="create-employee-form-label" type="text" htmlFor="create-employee-form-username">Employee Email</label>
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
