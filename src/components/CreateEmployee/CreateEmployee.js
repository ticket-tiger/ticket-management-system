import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CreateEmployee.css';

const CreateEmployee = ({ closeModal }) => {
  // const [accountCreationSuccessful, setAccountCreationSuccessful] = useState(false);
  const [accountCreationStatusCSSClass, setAccountCreationStatusCSSClass] = useState('');
  const [employeeUsername, setEmployeeUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('Bearer '));

      const config = {
        headers: {
          authorization: cookieValue || null,
        },
      };

      await axios.post('/users/create-employee', employeeUsername, config);
      closeModal();
      // setAccountCreationSuccessful(true);
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) setAccountCreationStatusCSSClass('status-400');
      else if (error.response.status >= 500) setAccountCreationStatusCSSClass('status-500');
      else setAccountCreationStatusCSSClass('status-default-error');
    }
  };

  return (
    <>
      {accountCreationStatusCSSClass === 'status-400' ? <p>Your credentials were incorrect.  Please try again.</p> : null}
      {accountCreationStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience</p> : null}
      {accountCreationStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
      {/* <h2 className="create-employee-heading">Create an account with us</h2> */}
      <form>
        <div>
          <input
            id="create-employee-form-username"
            onChange={(e) => setEmployeeUsername(e.target.value)}
            className={`create-employee-form-input ${accountCreationStatusCSSClass}`}
          />
          <label className="create-employee-form-label" type="text" htmlFor="create-employee-form-username">Employee Email</label>
        </div>
        <button className="create-employee-submit-button" type="submit" onClick={(e) => handleSubmit(e)}>Create Your Account</button>
      </form>
    </>
  );
};

CreateEmployee.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateEmployee;
