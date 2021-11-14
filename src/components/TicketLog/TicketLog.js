import React, { useEffect } from 'react';
// import axios from 'axios';
import './TicketLog.css';
import TicketLogRow from './TicketLogRow';
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
            <th className="ticket-log-table-header">Subject</th>
            <th className="ticket-log-table-header">Description</th>
            <th className="ticket-log-table-header">Urgency</th>
            <th className="ticket-log-table-header">Priority</th>
          </tr>
        </thead>
        <tbody>
          <TicketLogRow />
          <TicketLogRow />
          <TicketLogRow />
        </tbody>
      </table>
    </div>
  );
};
export default TicketLog;
