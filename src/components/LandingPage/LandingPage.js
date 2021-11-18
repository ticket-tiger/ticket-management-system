import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => (
  <div>
    <button type="button">
      <Link to="/create-account">
        Create Account
      </Link>
    </button>
    <button type="button">
      <Link to="/login">
        Login
      </Link>
    </button>
    <button type="button">
      <Link to="/user">
        Continue As Guest
      </Link>
    </button>
    <button type="button">
      <Link to="/employee">
        Continue As Employee
      </Link>
    </button>
  </div>
);

export default LandingPage;
