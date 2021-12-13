import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RequireAuth } from './auth';
import SubmitTicket from './pages/SubmitTicket/SubmitTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './pages/Login/Login';
import './App.css';

const App = () => {
  window.onload = () => {
    const numTabs = Number(window.localStorage.getItem('tabCounter'));
    if (!window.sessionStorage.getItem('refreshed')) {
      if (numTabs < 1) {
        window.localStorage.removeItem('email');
      }
    }
    window.localStorage.setItem('tabCounter', numTabs + 1);
  };
  window.onbeforeunload = () => {
    const numTabs = Number(window.localStorage.getItem('tabCounter'));
    window.localStorage.setItem('tabCounter', numTabs - 1);
    window.sessionStorage.setItem('refreshed', true);
  };
  return (
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
  );
};

export default App;
