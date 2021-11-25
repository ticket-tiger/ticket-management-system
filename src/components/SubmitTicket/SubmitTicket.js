import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => {
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketText, setTicketText] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Low');
  const [ticketUrgency, setTicketUrgency] = useState('Low');
  const [responseStatus, setResponseStatus] = useState(null);

  const sendPostRequest = async () => {
    setTicketPriority('Low');
    setTicketUrgency('Low');
    const ticket = {
      category: ticketCategory,
      title: ticketSubject,
      description: ticketText,
      priority: ticketPriority,
      urgency: ticketUrgency,
    };
    setTicketSubject('');
    setTicketText('');

    console.log('Ticket sent');
    try {
      // const response = await axios.post('http://localhost:3001/api/create-ticket', ticket);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-ticket`, ticket);
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };

  const clickHandler = async (event) => {
    event.preventDefault();
    setResponseStatus(await sendPostRequest());
  };

  const clickHandler2 = () => {

  };

  return (
    <>
      <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1>
      {responseStatus ? <p data-testid="responseStatus">{responseStatus}</p> : null}
      <form className="form">
        <div className="form-element">
          <label className="form-label" htmlFor="subject-input">
            <div className="label-text">Subject</div>
          </label>
          <input id="subject-input" className="form-input" type="text" onInput={(e) => setTicketSubject(e.target.value)} value={ticketSubject} />
        </div>
        <div className="form-element">
          <label className="form-label" htmlFor="category-dropdown">
            <div className="label-text">Category</div>
          </label>
          <select id="category-dropdown" className="form-input" onChange={(e) => setTicketCategory(e.target.value)} value={ticketCategory}>
            <option value="" selected disabled hidden>Select Category</option>
            <option value="Vendor Issues">Vendor Issues</option>
            <option value="Pre-Order questions">Pre-order Questions</option>
            <option value="Shipping">Shipping</option>
            <option value="Returns">Returns</option>
            <option value="Other">Other</option>
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
            onClick={(e) => clickHandler(e)}
          >
            Submit
          </button>
        </div>
      </form>
      {/* <table>
        <thead>
          <tr>
            <th>Title</th>
            <td>
              <input type="text" onInput={(e) => setTicketTitle(e.target.value)}
               value={ticketTitle} />
            </td>
          </tr>
          <tr>
            <th>Description</th>
            <td>
              <textarea type="text" onInput={(e) => setTicketText(e.target.value)}
              value={ticketText} />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Category</div>
                <select className="priority-select"
                onChange={(e) => setTicketCategory(e.target.value)} value={ticketCategory}>
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
                <select className="priority-select"
                onChange={(e) => setTicketUrgency(e.target.value)} value={ticketUrgency}>
                  <option value="" selected disabled hidden>Select Urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="submit-ticket__priority-level">
                <div className="priority-level__texts">Priority Level</div>
                <select className="priority-select"
                onChange={(e) => setTicketPriority(e.target.value)} value={ticketPriority}>
                  <option value="" selected disabled hidden>Select Priority</option>
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
