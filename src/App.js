import React from 'react';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import './App.css';

function App() {
  return (
    <div>
      <div className="submit-ticket-container">
        <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1>
        {/* <header className="App-header" /> */}
        <SubmitTicket />
      </div>
      <h3 className="ticket-log-heading">See our existing issues below...</h3>
      <TicketLog />
    </div>
  );
}

export default App;
