import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './CreatePermanentPassword.css';
import { useAuth } from '../../auth';

const CreatePermanentPassword = ({ closeModal }) => {
  const [passwordChangeStatusCSSClass, setPasswordChangeStatusCSSClass] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const auth = useAuth();

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

      const credentials = {
        username: auth.email,
        newPassword,
      };
      const response = await axios.post('/users/create-permanent-password', credentials, config);
      setPasswordChangeStatusCSSClass('200-status');
      closeModal();
      console.log(response.status);
    } catch (error) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) setPasswordChangeStatusCSSClass('status-400');
        else if (error.response.status >= 500) setPasswordChangeStatusCSSClass('status-500');
        else setPasswordChangeStatusCSSClass('status-default-error');
      } else setPasswordChangeStatusCSSClass('status-default-error');
    }
  };

  return (
    <>
      <form>
        <input
          id="newPassword"
          className={`permanent-password-form-input ${passwordChangeStatusCSSClass}`}
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="permanent-password-form-label" htmlFor="newPassword">New Password</label>
        <button type="submit" className="permanent-password-form-button" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </>
  );
};

CreatePermanentPassword.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreatePermanentPassword;
