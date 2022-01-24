import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './auth';
import CreateTicket from './pages/CreateTicket/CreateTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route element={<NavBar />}>
        <Route path="/" element={<Navigate to="/create-ticket" />} />
        <Route
          path="/create-ticket"
          element={(
            <CreateTicket />
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

export default App;
