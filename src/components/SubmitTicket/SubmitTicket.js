import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => {
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketText, setTicketText] = useState('');
  const [ticketPriority, setTicketPriority] = useState('');
  const [ticketUrgency, setTicketUrgency] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);

  const sendPostRequest = async () => {
    const ticket = {
      category: ticketCategory,
      title: ticketTitle,
      description: ticketText,
      priority: ticketPriority,
      urgency: ticketUrgency,
    };
    setTicketTitle('');
    setTicketText('');

    console.log('Ticket sent');
    try {
      const response = await axios.post('http://localhost:3001/api/create-ticket', ticket);
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };

  const clickHandler = async () => {
    setResponseStatus(await sendPostRequest());
  };

  const clickHandler2 = () => {

  };

  return (
    <>
      {responseStatus ? <p data-testid="responseStatus">{responseStatus}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <td>
              <input type="text" onInput={(e) => setTicketTitle(e.target.value)} value={ticketTitle} />
            </td>
          </tr>
          <tr>
            <th>Description</th>
            <td>
              <textarea type="text" onInput={(e) => setTicketText(e.target.value)} value={ticketText} />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Category</div>
                <select className="priority-select" onChange={(e) => setTicketCategory(e.target.value)} value={ticketCategory}>
                  <option value="" selected disabled hidden>Select Category</option>
                  <option value="Vendor Issues">Vendor Issues</option>
                  <option value="Pre-Order questions">Pre-order Questions</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Urgency Level</div>
                <select className="priority-select" onChange={(e) => setTicketUrgency(e.target.value)} value={ticketUrgency}>
                  <option value="" selected disabled hidden>Select Urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Priority Level</div>
                <select className="priority-select" onChange={(e) => setTicketPriority(e.target.value)} value={ticketPriority}>
                  <option value="" selected disabled hidden>Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button type="submit" onClick={() => clickHandler2()}>
          Cancel
        </button>
        <button
          type="submit"
                  // className = 'submit-ticket__button'
          onClick={() => clickHandler()}
        >
          Submit
        </button>
      </div>
    </>
  );
};
export default SubmitTicket;
