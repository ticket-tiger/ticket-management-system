import React, {
  useEffect, useState, useMemo, useReducer,
} from 'react';
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
    if (!items) return items;
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

// const sampleTickets = [{
//   _id: '1', title: 'SDcasdc', description: 'apple', status:
// 'Submitted', priority: '10', urgency: '8', date: '12/10/21',
// }, {
//   _id: '2', title: 'ZSCsc', description: 'banana', status:
// 'In Progress', priority: '1', urgency: '5', date: '5/09/21',
// },
// {
//   _id: '3', title: 'anonymous', description: 'apple', status:
// 'Resolved', priority: '10', urgency: '1', date: '12/10/21',
// }, {
//   _id: '4', title: 'anonymous', description: 'mandarin', status:
// 'Submitted', priority: '2', urgency: '6', date: '01/10/19',
// },
// {
//   _id: '5', title: 'Badport', description: 'apple', status:
// 'In Progress', priority: '4', urgency: '9', date: '3/23/21',
// }];

const TicketTable = () => {
  const [tickets, setTickets] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketisEditable, setTicketisEditable] = useState(null);
  const [ticketStatusCSSClass, setTicketCreationStatusCSSClass] = useState('');
  const auth = useAuth();

  const reducer = (state, action) => {
    switch (action.type) {
      case 'title':
        return {
          ...state,
          title: action.payload,
        };
      case 'date':
        return {
          ...state,
          date: action.payload,
        };
      case 'status':
        return {
          ...state,
          status: action.payload,
        };
      case 'priority':
        return {
          ...state,
          priority: action.payload,
        };
      case 'urgency':
        return {
          ...state,
          date: action.payload,
        };
      case 'description':
        return {
          ...state,
          description: action.payload,
        };
      case 'ticket':
        return {
          ...action.payload,
        };
      default:
        return state;
    }
  };

  const [selectedTicket, dispatch] = useReducer(reducer, {});

  const getTickets = async () => {
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
    } catch (error) {
      auth.signout();
    }
  };
  useEffect(getTickets, []);
  const { sortItems, requestSort } = useSortableData(tickets);

  const openModal = (ticketTitle) => {
    // Fill the modal with the right ticket data
    dispatch({ type: 'ticket', payload: sortItems.find((ticket) => ticket.title === ticketTitle) });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('Bearer '));

      const config = {
        headers: {
          authorization: cookieValue || null,
        },
      };

      await axios.post('tickets/update-ticket', selectedTicket, config);
      setIsModalOpen(false);
    } catch (error) {
      if (error.response.status === 401) setTicketCreationStatusCSSClass('status-401');
      else if (error.response.status >= 500) setTicketCreationStatusCSSClass('status-500');
      else setTicketCreationStatusCSSClass('status-default-error');
    }
  };

  return (
    <>
      {isModalOpen ? (
        <Modal close={() => setIsModalOpen(false)}>
          <div className="error-message-group">
            {ticketStatusCSSClass === 'status-401' ? <p> 401 Unauthorized. We have notified the Feds.</p> : null}
            {ticketStatusCSSClass === 'status-500' ? <p>There was a problem with the server.  Sorry for the inconvenience.</p> : null}
            {ticketStatusCSSClass === 'status-default-error' ? <p>There was an unexpected error.  Please try again in a little while.</p> : null}
          </div>
          {auth.user.role === 'Manager' ? (
            <div className="ticket-button-group">
              <FontAwesomeIcon className="edit-ticket-button" icon={faEdit} size="2x" onClick={() => setTicketisEditable(true)} />
              <FontAwesomeIcon className="delete-ticket-button" icon={faTrashAlt} size="2x" />
            </div>
          ) : null}
          <div className="selected-ticket-data-group">
            {ticketisEditable ? (
              <>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-title-input">Title:</label>
                  <input id="selected-ticket-title-input" type="text" value={selectedTicket.title} onChange={(e) => dispatch({ type: 'title', payload: e.target.value })} />
                </div>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-date-input">Date Created:</label>
                  <input id="selected-ticket-date-input" className="selected-ticket-data" value={selectedTicket.date} onChange={(e) => dispatch({ type: 'date', payload: e.target.value })} />
                </div>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-status-input">Status:</label>
                  <input id="selected-ticket-status-input" className="selected-ticket-data" value={selectedTicket.status} onChange={(e) => dispatch({ type: 'status', payload: e.target.value })} />
                </div>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-priority-input">Priority:</label>
                  <input id="selected-ticket-priority-input" className="selected-ticket-data" value={selectedTicket.priority} onChange={(e) => dispatch({ type: 'priority', payload: e.target.value })} />
                </div>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-urgency-input">Urgency:</label>
                  <input id="selected-ticket-urgency-input" className="selected-ticket-data" value={selectedTicket.urgency} onChange={(e) => dispatch({ type: 'urgency', payload: e.target.value })} />
                </div>
                <div>
                  <label className="selected-ticket-label" htmlFor="selected-ticket-description-input">Description:</label>
                  <input id="selected-ticket-description-input" className="selected-ticket-data" value={selectedTicket.description} onChange={(e) => dispatch({ type: 'description', payload: e.target.value })} />
                </div>
                <button type="button" onClick={() => setTicketisEditable(false)}>Cancel</button>
                <button type="submit" onClick={(e) => handleUpdate(e)}> Submit</button>

              </>

            )
              : (
                <>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-title-p">Title:</label>
                    <p id="selected-ticket-title-p" className="selected-ticket-data">{selectedTicket.title}</p>
                  </div>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-date-p">Date Created:</label>
                    <p id="selected-ticket-date-p" className="selected-ticket-data">{selectedTicket.date}</p>
                  </div>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-status-p">Status:</label>
                    <p id="selected-ticket-status-p" className="selected-ticket-data">{selectedTicket.status}</p>
                  </div>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-priority-p">Priority:</label>
                    <p id="selected-ticket-priority-p" className="selected-ticket-data">{selectedTicket.priority}</p>
                  </div>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-urgency-p">Urgency:</label>
                    <p id="selected-ticket-urgency-p" className="selected-ticket-data">{selectedTicket.urgency}</p>
                  </div>
                  <div>
                    <label className="selected-ticket-label" htmlFor="selected-ticket-description-p">Description:</label>
                    <p id="selected-ticket-description-p" className="selected-ticket-data">{selectedTicket.description}</p>
                  </div>
                </>
              )}
          </div>

        </Modal>
      ) : null }
      {tickets
        ? (
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
                      onClick={() => requestSort('status')}
                    >
                      Status
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
                  <tr className="ticket-table-row" onClick={() => openModal(ticket.title)} key={ticket._id}>
                    <td key="title">{ticket.title}</td>
                    <td key="description">{ticket.description}</td>
                    <td key="status">{ticket.status}</td>
                    <td key="priority">{ticket.priority}</td>
                    <td key="urgency">{ticket.urgency}</td>
                    <td key="date">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        : null }
    </>
  );
};

export default TicketTable;
