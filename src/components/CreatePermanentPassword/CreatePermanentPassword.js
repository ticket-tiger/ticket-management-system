import React, { useState } from 'react';
import axios from 'axios';
import './CreatePermanentPassword.css';
import { useAuth } from '../../auth';

const CreatePermanentPassword = () => {
  const [newPassword, setNewPassword] = useState('');

  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: auth.email,
      newPassword,
    };
    const response = await axios.post('/users/create-permanent-password', credentials);
    console.log(response.status);
  };

  return (
    <>
      <form>
        <input id="newPassword" type="password" onChange={(e) => setNewPassword(e.target.value)} />
        <label htmlFor="newPassword">New Password</label>
        <button type="submit" className="permanent-password-button" onSubmit={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </>
  );
};

export default CreatePermanentPassword;
