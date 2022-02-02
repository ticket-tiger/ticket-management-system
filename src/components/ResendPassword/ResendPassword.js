import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ResendPassword.css';

const ResendPassword = ({ employeeArray }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/resend-one-time-password', JSON.parse(selectedEmployee));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select className="resend-password-employee-dropdown" onChange={(e) => setSelectedEmployee(e.target.value)}>
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
      <button type="submit" className="resend-password-submit-button" onClick={(e) => handleSubmit(e)}>Send</button>
    </div>
  );
};

ResendPassword.propTypes = {
  employeeArray: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default ResendPassword;
