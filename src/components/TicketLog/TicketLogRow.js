import React from 'react';
import './TicketLogRow.css';

const TicketLogRow = () => (
  <tr className="ticket-log-row">
    <td className="first-cell">
      Subject
    </td>
    <td>
      Category
    </td>
    <td>
      Urgency
    </td>
    <td className="last-cell">
      Priority
    </td>
  </tr>
);

export default TicketLogRow;
