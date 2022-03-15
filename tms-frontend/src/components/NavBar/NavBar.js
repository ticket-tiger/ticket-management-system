import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../auth';
import Modal from '../reusableComponents/Modal';
import Login from '../Login/Login';
import CreateAccount from '../CreateAccount/CreateAccount';
import CreateEmployee from '../CreateEmployee/CreateEmployee';
import './NavBar.css';

const NavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPermanentPasswordModalOpen, setIsPermanentPasswordModalOpen] = useState(false);
  const [navbarContainerIsVisible, setNavbarContainerIsVisible] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  // const [navbarButtonDescriptionCSSClass, setNavbarButtonDescriptionCSSClass] = useState({
  //   createAccount: 'display-none',
  //   viewTickets: 'display-none',
  //   manageEmployees: 'display-none',
  // });

  const auth = useAuth();
  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      auth.signout();
    } catch (error) {
      console.log(error.response.status);
    }
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

  const closeCreateAccountForm = (httpStatus) => {
    setIsModalOpen(false);
    setResponseStatus(httpStatus);
  };

  const closeEmployeeForm = () => {
    setIsEmployeeModalOpen(false);
  };

  const hideTabs = (bool) => {
    setIsPermanentPasswordModalOpen(bool);
  };

  return (
    <div>
      <div
        className={`account-created-feedback ${responseStatus === 200 ? 'fade' : ''}`}
        onAnimationEnd={() => setResponseStatus('')}
      >
        <FontAwesomeIcon className="account-created-check" icon={faCheck} size="2x" />
        <p className="account-created-text">Account Created</p>
      </div>
      <h1 className="logo">Ticket Tiger</h1>
      <button type="button" className="navbar-menu-button" onClick={() => setNavbarContainerIsVisible(!navbarContainerIsVisible)}>
        <FontAwesomeIcon icon={faBars} size="3x" />
      </button>
      <div className={`navbar-container ${navbarContainerIsVisible ? 'visibility-visible' : ''}`}>
        <nav className="navbar">
          {auth.user.email ? (
            <>
              <Link to="/create-ticket" className="navbar-link-button">
                <button type="button" id="create-ticket-navbar-button" className="navbar-button">
                  Create A Ticket
                </button>
                <p className="create-ticket-button-description navbar-button-description">
                  Tell us about an issue you are having.  We will work with you to resolve it
                  as quickly as possible.
                </p>
              </Link>
              <Link to="/view-tickets" className="navbar-link-button">
                <button type="button" id="view-tickets-navbar-button" className="navbar-button">
                  {auth.user.role === 'Basic'
                    ? 'View Your Tickets'
                    : 'Manage Tickets'}
                </button>
                <p className="view-tickets-button-description navbar-button-description">
                  {auth.user.role === 'Basic'
                    ? 'Check the status of tickets you already submitted.'
                    : 'View and edit any existing tickets.'}
                </p>
              </Link>
              {auth.user.role === 'Manager' ? (
                <Link to="/manage-employees" className="navbar-link-button">
                  <button type="button" id="manage-employees-navbar-button" className="navbar-button">
                    Manage Employees
                  </button>
                  <p className="manage-employees-button-description navbar-button-description">
                    Create new employees or resend a one-time password to an existing employee.
                  </p>
                </Link>
              ) : null}
              <button type="button" onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          )
            : (
              <>
                <button type="button" onClick={openLoginModal} className="navbar-button">
                  Login
                </button>
                <button type="button" onClick={openCreateAccountModal} className="navbar-button">
                  Sign Up
                </button>
              </>
            )}
        </nav>
      </div>
      {isModalOpen
        ? (
          <Modal hideCloseModalButton={isPermanentPasswordModalOpen} close={closeUserForm}>
            <div>
              <div className={`user-modal-button-group ${isPermanentPasswordModalOpen ? 'display-none' : ''}`}>
                <button className="user-modal-button" type="button" onClick={() => setHasAccount(true)} disabled={hasAccount}>Login</button>
                <button className="user-modal-button" type="button" onClick={() => setHasAccount(false)} disabled={!hasAccount}>Sign Up</button>
              </div>
              {hasAccount
                ? <Login hideTabs={hideTabs} closeModal={closeUserForm} />
                : <CreateAccount closeModal={closeCreateAccountForm} />}
            </div>
          </Modal>
        ) : null}
      {isEmployeeModalOpen
        ? (
          <Modal close={closeEmployeeForm}>
            <CreateEmployee closeModal={closeEmployeeForm} />
          </Modal>
        ) : null}
      <Outlet />
    </div>
  );
};

export default NavBar;
