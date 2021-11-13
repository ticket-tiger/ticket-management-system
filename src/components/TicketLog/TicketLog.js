import React, { useEffect } from 'react';
// import axios from 'axios';
import './TicketLog.css';
import Ticket from './Ticket';
// import SubmitTicket from '../SubmitTicket/SubmitTicket';

const TicketLog = () => {
  useEffect(() => {
    //   getTickets()
  }, []);

  //   const sendTicketText = async () => {
  //     const response = await axios.get('http://localhost:3001/api/get-tickets',{

  //       });
  //  };
  return (
  // This function is waiting for the server to send ticket data from the server
    <div className="ticket-log-container">
      <table className="ticket-log-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Description</th>
            <th>Urgency</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <Ticket />
          <Ticket />
          <Ticket />
        </tbody>
      </table>
    </div>
  );
};
export default TicketLog;
