import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
// import axios from 'axios';
import { AuthProvider, RequireAuth } from './auth';
import CreateTicket from './pages/CreateTicket/CreateTicket';
import ViewTickets from './pages/ViewTickets/ViewTickets';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const App = () => {
  // const auth = useAuth();
  window.onload = () => {
    const numTabs = Number(window.localStorage.getItem('tabCounter'));
    window.localStorage.setItem('tabCounter', numTabs + 1);
  };
  window.onunload = () => {
    const numTabs = Number(window.localStorage.getItem('tabCounter'));
    // if (numTabs === 1 && window.localStorage.getItem('email')) {
    //   try {
    //     axios.post('/users/logout');
    //     auth.signout();
    //   } catch (error) {
    //     console.log(error.response.status);
    //   }
    // }
    window.localStorage.setItem('tabCounter', numTabs - 1);
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
