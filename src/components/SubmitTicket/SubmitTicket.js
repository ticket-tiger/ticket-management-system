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
      <form className="form">
        <div className="form-element">
          <label className="form-label" htmlFor="name-input">
            <div className="label-text">Name</div>
          </label>
          <input id="name-input" className="form-input" />
        </div>
        <div className="form-element">
          <label className="form-label" htmlFor="category-dropdown">
            <div className="label-text">Category</div>
          </label>
          <select id="category-dropdown" className="form-input">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-element">
          <label className="form-label" htmlFor="description-textarea">
            <div className="label-text">Description</div>
          </label>
          <textarea id="description-textarea" className="form-input form-textarea" />
        </div>
        <div className="form-button-group">
          <button className="form-button" type="submit" onClick={() => clickHandler2()}>
            Cancel
          </button>
          <button
            className="form-button"
            type="submit"
                  // className = 'submit-ticket__button'
            onClick={() => clickHandler()}
          >
            Submit
          </button>
        </div>
      </form>
      {/* <table>
        <thead>
          <tr>
            <th>What is the issue you are currently having?</th>
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
      </table> */}
    </>
  );
};
export default SubmitTicket;
