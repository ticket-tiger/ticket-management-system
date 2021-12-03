import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import NavBar from './components/NavBar/NavBar';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import './App.css';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route element={<NavBar />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
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
      </Route>
    </Routes>
  </AuthProvider>
);

export default App;
