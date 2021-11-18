import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TicketLog.css';
// import TicketLogRow from './TicketLogRow';

const TicketLog = () => {
  const [aTicket, setATicket] = useState(null);
  useEffect(async () => {
    const response = await axios.get('http://localhost:3001/api/get-ticket-collection');
    console.log(response.data);
    setATicket(response.data);
  }, []);
  const ticketDetails = () => {
  };
  if (!aTicket) return null;
  return (
  // This function is waiting for the server to send ticket data from the server
    <div className="ticket-log-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th className="ticket-log-table-header">Category</th>
            <th className="ticket-log-table-header">Subject</th>
            <th className="ticket-log-table-header">Description</th>
            <th className="ticket-log-table-header">Urgency</th>
            <th className="ticket-log-table-header">Priority</th>
            <th className="ticket-log-table-header2">Select Ticket</th>
          </tr>
        </thead>
        <tbody>
          {aTicket.map((ticket) => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={ticket._id}>
              <td>{ticket.category}</td>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.urgency}</td>
              <td className="view-ticket">
                <button type="submit" aria-label="ticket-details" onClick={() => ticketDetails()}>
                  View

                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TicketLog;
