import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import './NavBar.css';

const NavBar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signout();
    navigate('/login');
  };
  return (
    <div>
      {auth.user ? (
        <>
          <Link to="/view-tickets">
            <button type="button">
              View Your Tickets
            </button>
          </Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )
        : (
          <>
            <Link to="/login">
              <button type="button">
                Login
              </button>
            </Link>
          </>
        )}
      <p>{auth.user}</p>
      <Outlet />
    </div>
  );
};

export default NavBar;
