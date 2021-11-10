import React from 'react';
import SubmitTicket from './components/SubmitTicket/SubmitTicket';
import TicketLog from './components/TicketLog/TicketLog';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" />
      <TicketLog />
      <SubmitTicket />
      <p>Test</p>
    </div>
  );
}

export default App;
