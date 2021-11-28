import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import './LandingPage.css';

const LandingPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signout();
    navigate('/login');
  };
  return (
    <div>
      {/* <Link to="/create-account">
        <button type="button">
          Create Account
        </button>
      </Link> */}
      {auth.user || auth.user === '' ? (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      )
        : (
          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>
        )}
      <Link to="/user">
        <button type="button">
          Continue As Guest
        </button>
      </Link>
      <Outlet />
    </div>
  );
};

export default LandingPage;
