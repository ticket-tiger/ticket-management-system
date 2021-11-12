import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => {
  const [ticketText, setTicketText] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);

  const sendPostRequest = async () => {
    const ticket = {
      category: 'category1',
      title: 'test1',
      description: ticketText,
      priority: 'Low',
      urgency: 'High',
    };
    setTicketText('');
    console.log('Ticket sent');
    const response = await axios.post('http://localhost:3001/api/create-ticket', ticket);
    return response.status;
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
            <th>What is the issue you are currently having?</th>
            <td>
              <textarea type="text" onInput={(e) => setTicketText(e.target.value)} value={ticketText} />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Priority Level</div>
                <select className="priority-select">
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
