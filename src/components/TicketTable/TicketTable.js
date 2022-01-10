import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Modal from '../reusableComponents/Modal';
import { useAuth } from '../../auth';
import './TicketTable.css';
// import SubmitTicket from '../SubmitTicket/SubmitTicket';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);
  const sortItems = useMemo(() => {
    const sortedItems = [...items];
    if (sortConfig != null) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.field].toLowerCase() < b[sortConfig.field].toLowerCase()) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.field].toLowerCase() > b[sortConfig.field].toLowerCase()) {
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
  title: 'SDcasdc', description: 'apple', priority: '10', urgency: '8', date: '12/10/21',
}, {
  title: 'ZSCsc', description: 'banana', priority: '1', urgency: '5', date: '5/09/21',
},
{
  title: 'anonymous', description: 'apple', priority: '10', urgency: '1', date: '12/10/21',
}, {
  title: 'anonymous', description: 'mandarin', priority: '2', urgency: '6', date: '01/10/19',
},
{
  title: 'Badport', description: 'apple', priority: '4', urgency: '9', date: '3/23/21',
}];

const TicketTable = () => {
  const [tickets, setTickets] = useState(sampleTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useAuth();

  useEffect(async () => {
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('Bearer '));

      const config = {
        headers: {
          authorization: cookieValue || null,
        },
      };

      const response = await axios.get('/tickets/get-tickets', config);
      setTickets(response.data);
      auth.signin(window.localStorage.getItem('email'));
    } catch (error) {
      auth.signout();
    }
  }, []);
  const { sortItems, requestSort } = useSortableData(tickets);

  return (
    <>
      {isModalOpen ? (
        <Modal close={() => setIsModalOpen(false)}>
          {/* {sortItems.find(ticket => )} */}
          <div className="ticket-button-group">
            <FontAwesomeIcon className="edit-ticket-button" icon={faEdit} size="2x" />
            <FontAwesomeIcon className="delete-ticket-button" icon={faTrashAlt} size="2x" />
          </div>
        </Modal>
      ) : null }
      <div className="ticket-table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th className="ticket-table-header">
                <button
                  className="ticket-table-header-button"
                  type="button"
                  onClick={() => requestSort('title')}
                >
                  Title
                </button>
              </th>

              <th className="ticket-table-header">
                <button
                  className="ticket-table-header-button"
                  type="button"
                  onClick={() => requestSort('description')}
                >
                  Description
                </button>
              </th>

              <th className="ticket-table-header">
                <button
                  className="ticket-table-header-button"
                  type="button"
                  onClick={() => requestSort('priority')}
                >
                  Priority
                </button>
              </th>

              <th className="ticket-table-header">
                <button
                  className="ticket-table-header-button"
                  type="button"
                  onClick={() => requestSort('urgency')}
                >
                  Urgency
                </button>
              </th>

              <th className="ticket-table-header">
                <button
                  className="ticket-table-header-button"
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
              <tr className="ticket-table-row" onClick={() => setIsModalOpen(true)} key={ticket.id}>
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
    </>
  );
};

export default TicketTable;
