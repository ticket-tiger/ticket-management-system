import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import LandingPage from './components/LandingPage/LandingPage';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<SubmitTicket />} />
        <Route path="/employee" element={<TicketLog />} />
        {/* <div>
        <LandingPage />
        <div className="submit-ticket-container">
          <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1>
          <SubmitTicket />
        </div>
        <h3 className="ticket-log-heading">See our existing issues below...</h3>
        <TicketLog />
      </div> */}
      </Routes>
    </div>
  );
}

export default App;
