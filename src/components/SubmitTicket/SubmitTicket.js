import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => {
  // const [ticketText, setTicketText] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);

  const sendPostRequest = async () => {
    const ticket = {
      category: 'category1',
      title: 'test1',
      description: 'The login button doesn\x27t work.',
      priority: 'Low',
      urgency: 'High',
    };
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
      <form>
        <label className="form-label">
          Username
          <input />
        </label>
        <label className="form-label">
          Category
          <select>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <label className="form-label">
          Description
          <textarea />
        </label>
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
      </form>
      <table>
        <thead>
          <tr>
            <th>What is the issue you are currently having?</th>
            <td>
              {/* <textarea type="text" onInput={(e) => setTicketText(e.target.value)} /> */}
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
    </>
  );
};
export default SubmitTicket;
