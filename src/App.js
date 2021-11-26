import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import LandingPage from './components/LandingPage/LandingPage';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import './App.css';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/user" element={<SubmitTicket />} />
        <Route path="/employee" element={<TicketLog />} /> */}
      <Route
        path="/user"
        element={(
          <RequireAuth>
            <SubmitTicket />
          </RequireAuth>
      )}
      />
      <Route
        path="/employee"
        element={(
          <RequireAuth>
            <TicketLog />
          </RequireAuth>
          )}
      />
    </Routes>
  </AuthProvider>
);

export default App;
