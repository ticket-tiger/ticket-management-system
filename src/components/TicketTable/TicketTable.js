import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth';
import './TicketTable.css';
// import SubmitTicket from '../SubmitTicket/SubmitTicket';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);
  const sortItems = useMemo(() => {
    const sortedItems = [...items];
    if (sortConfig != null) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.field] < b[sortConfig.field]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.field] > b[sortConfig.field]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [items, sortConfig]);

  const requestSort = (field) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.field === field && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ field, direction });
  };
  // returning the sorted items and the requestSort function
  return { sortItems, requestSort };
};

const sampleTickets = [{
  title: '1', description: 'apple', priority: '10', urgency: '8', date: '12/10/21',
}, {
  title: '23', description: 'banana', priority: '1', urgency: '5', date: '5/09/21',
},
{
  title: '1', description: 'apple', priority: '10', urgency: '1', date: '12/10/21',
}, {
  title: '3', description: 'mandarin', priority: '2', urgency: '6', date: '01/10/19',
},
{
  title: 'bad port', description: 'apple', priority: '4', urgency: '9', date: '3/23/21',
}];

const TicketLog = () => {
  const [tickets, setTickets] = useState(sampleTickets);
  const auth = useAuth();

  useEffect(async () => {
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('test2='))
        .split('=')[1];

      const config = {
        authorization: cookieValue,
      };

      const response = await axios.get(`${process.env.REACT_APP_TICKETS_URL}/get-tickets`, config);
      setTickets(response.data);
      auth.signin(window.localStorage.getItem('email'));
    } catch (error) {
      auth.signout();
    }
  }, []);
  const { sortItems, requestSort } = useSortableData(tickets);

  return (
    <div className="ticket-log-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th className="ticket-log-table-header">
              <button
                type="button"
                onClick={() => requestSort('title')}
              >
                Title
              </button>
            </th>

            <th className="ticket-log-table-header">
              <button
                type="button"
                onClick={() => requestSort('description')}
              >
                Description
              </button>
            </th>

            <th className="ticket-log-table-header">
              <button
                type="button"
                onClick={() => requestSort('priority')}
              >
                Priority
              </button>
            </th>

            <th className="ticket-log-table-header">
              <button
                type="button"
                onClick={() => requestSort('urgency')}
              >
                Urgency
              </button>
            </th>

            <th className="ticket-log-table-header">
              <button
                type="button"
                onClick={() => requestSort('date')}
              >
                Date Created
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {sortItems.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.urgency}</td>
              <td>{ticket.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TicketLog;
