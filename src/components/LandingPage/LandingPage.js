import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => (
  <div>
    <Link to="/create-account">
      <button type="button">
        Create Account
      </button>
    </Link>
    <Link to="/login">
      <button type="button">
        Login
      </button>
    </Link>
    <Link to="/user">
      <button type="button">
        Continue As Guest
      </button>
    </Link>
    <Link to="/employee">
      <button type="button">
        Continue As Employee
      </button>
    </Link>
  </div>
);

export default LandingPage;
