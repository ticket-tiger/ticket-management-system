import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
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

  const openCreateEmployeeModal = () => {
    setIsEmployeeModalOpen(true);
  };

  const closeEmployeeForm = () => {
    setIsEmployeeModalOpen(false);
  };

  return (
    <div>
      <h1 className="logo">Ticket Management System</h1>
      <nav className="navbar">
        {auth.user.email ? (
          <>
            <Link to="/create-ticket" className="navbar-button">
              <button type="button" className="navbar-button">
                Create A Ticket
              </button>
            </Link>
            <Link to="/view-tickets" className="navbar-button">
              <button type="button" className="navbar-button">
                View Your Tickets
              </button>
            </Link>
            <button type="button" onClick={openCreateEmployeeModal} className="navbar-button">
              Create Employee
            </button>
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
      {isModalOpen
        ? (
          <Modal hideCloseModalButton={isPermanentPasswordModalOpen} close={closeUserForm}>
            <div>
              <div className={`user-modal-button-group ${isPermanentPasswordModalOpen ? 'display-none' : ''}`}>
                <button className="user-modal-button" type="button" onClick={() => setHasAccount(true)} disabled={hasAccount}>Login</button>
                <button className="user-modal-button" type="button" onClick={() => setHasAccount(false)} disabled={!hasAccount}>Sign Up</button>
              </div>
              {hasAccount
                ? <Login hideTabs={setIsPermanentPasswordModalOpen} closeModal={closeUserForm} />
                : <CreateAccount closeModal={closeUserForm} />}
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
