import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ResendPassword.css';

const ResendPassword = ({ employeeArray, closeModal, displayComponent }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/resend-one-time-password', JSON.parse(selectedEmployee));
      console.log(response);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button type="button" onClick={() => displayComponent(false)}>Back</button>
      <select onChange={(e) => setSelectedEmployee(e.target.value)}>
        {employeeArray.map(
          (employee) => (
            <option
              key={employee._id}
              value={JSON.stringify(employee)}
            >
              {employee.email}
            </option>
          ),
        )}
      </select>
      <button type="submit" onClick={(e) => handleSubmit(e)}>Resend One-Time Password</button>
    </div>
  );
};

ResendPassword.propTypes = {
  employeeArray: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  closeModal: PropTypes.func.isRequired,
  displayComponent: PropTypes.func.isRequired,
};

export default ResendPassword;
