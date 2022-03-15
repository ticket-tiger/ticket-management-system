import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateEmployee from '../../components/CreateEmployee/CreateEmployee';
import ResendPassword from '../../components/ResendPassword/ResendPassword';
import './ManageEmployees.css';

const ManageEmployees = () => {
  const [oneTimePasswordEmployees, setOneTimePasswordEmployees] = useState([]);

  useEffect(() => {
    const getOneTimeEmployees = async () => {
      const response = await axios.get('/users/get-one-time-employees');
      setOneTimePasswordEmployees(response.data);
    };
    getOneTimeEmployees();
  }, []);

  return (
    <div className="manage-employees-container">
      <div className="create-employee-container">
        <div className="manage-employees-component-card">
          <h1 className="create-employee-heading">Create an Employee</h1>
          <CreateEmployee />
        </div>
      </div>
      <div className="resend-password-container">
        <div className="manage-employees-component-card">
          <h1 className="resend-password-heading">Resend a One-Time Password</h1>
          <ResendPassword employeeArray={oneTimePasswordEmployees} />
        </div>
      </div>
    </div>
  );
};
export default ManageEmployees;
