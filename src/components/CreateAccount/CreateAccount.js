import React from 'react';
import './CreateAccount.css';

const CreateAccount = () => (
  <>
    <h1>Create an account with us</h1>
    <form>
      <label type="text" htmlFor="create-account-form-username">Username</label>
      <input id="create-account-form-username" />
      <label htmlFor="create-account-form-paswword">Password</label>
      <input type="password" id="create-account-form-password" />
      <button type="submit">Submit</button>
    </form>
  </>
);

export default CreateAccount;
