import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import SubmitTicket from './pages/SubmitTicket/SubmitTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './pages/Login/Login';
import './App.css';

const App = () => {
  window.onload = () => {
    // window.localStorage.setItem('user', window.localStorage.getItem('user'));
    const tabCounter = window.localStorage.getItem('tabCounter');
    if (!window.sessionStorage.getItem('refreshed')) {
      if (tabCounter === null || parseInt(tabCounter, 10) < 1) {
        window.localStorage.removeItem('user');
      }
    }
    window.localStorage.setItem('tabCounter', tabCounter === null ? tabCounter + 1 : parseInt(tabCounter, 10) + 1);
  };
  window.onbeforeunload = () => {
    const tabCounter = window.localStorage.getItem('tabCounter');
    window.localStorage.setItem('tabCounter', tabCounter === null ? tabCounter - 1 : parseInt(tabCounter, 10) - 1);
    window.sessionStorage.setItem('refreshed', true);
  };
  return (
    <AuthProvider>
      <Routes>
        <Route element={<NavBar />}>
          <Route path="/" element={<Navigate to="/create-ticket" />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-ticket"
            element={(
              <SubmitTicket />
      )}
          />
          <Route
            path="/view-tickets"
            element={(
              <RequireAuth>
                <ViewTickets />
              </RequireAuth>
          )}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
