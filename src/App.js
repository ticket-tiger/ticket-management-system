import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import CreateTicket from './pages/CreateTicket/CreateTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
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
              <ViewTickets />
            // <RequireAuth>
            //   <ViewTickets />
            // </RequireAuth>
          )}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
