import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import SubmitTicket from './pages/SubmitTicket/SubmitTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './pages/Login/Login';
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
              <ViewTickets />
            </RequireAuth>
          )}
        />
      </Route>
    </Routes>
  </AuthProvider>
);

export default App;
