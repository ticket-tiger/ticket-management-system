import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import Modal from '../reusableComponents/Modal';
import Login from '../Login/Login';
import CreateAccount from '../CreateAccount/CreateAccount';
import './NavBar.css';

const NavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signout();
    navigate('/login');
  };

  const openLoginModal = () => {
    setHasAccount(true);
    setIsModalOpen(true);
  };

  const openCreateAccountModal = () => {
    setHasAccount(false);
    setIsModalOpen(true);
  };

  const closeUserForm = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {auth.email ? (
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
            <button type="button" onClick={openLoginModal} className="button login__signup">
              <span className="button__text">Login</span>
              <i className="button__icon fas fa-chevron-right" />
            </button>
            <button type="button" onClick={openCreateAccountModal} className="button login__signup">
              <span className="button__text">Sign Up</span>
              <i className="button__icon fas fa-chevron-right" />
            </button>
          </>
        )}
      <p>{auth.email}</p>
      {isModalOpen
        ? (
          <Modal closeForm={closeUserForm}>
            <div>
              <button type="button" onClick={() => setHasAccount(true)} disabled={hasAccount}>Login</button>
              <button type="button" onClick={() => setHasAccount(false)} disabled={!hasAccount}>Sign Up</button>
              {hasAccount
                ? <Login />
                : <CreateAccount />}
            </div>
          </Modal>
        ) : null}
      <Outlet />
    </div>
  );
};

export default NavBar;
