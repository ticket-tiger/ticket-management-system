import React from 'react';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import './App.css';

function App() {
  return (
    <div>
      <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1>
      <div className="App">
        <header className="App-header" />
        <SubmitTicket />
      </div>
      <h3 className="ticket-log-heading">See our existing issues below...</h3>
      <TicketLog />
    </div>
  );
}

export default App;
