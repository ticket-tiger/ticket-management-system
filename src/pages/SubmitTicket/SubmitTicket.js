import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth';
import './SubmitTicket.css';

const SubmitTicket = () => {
//   const [ticketCategory, setTicketCategory] = useState('');
//   const [ticketPriority, setTicketPriority] = useState('Low');
//   const [ticketUrgency, setTicketUrgency] = useState('Low');
  const [responseStatus, setResponseStatus] = useState(null);
  const [state, setState] = useState({
    ticketCategory: '',
    ticketPriority: 'Low',
    ticketUrgency: 'Low',
    subjectText: '',
    descriptionText: '',
  });
  const auth = useAuth();

  const handleChange = (e) => {
    const { value } = e.target;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const sendPostRequest = async () => {
    setState({ ticketPriority: 'Low' });
    setState({ ticketUrgency: 'Low' });
    const ticket = {
      category: state.ticketCategory,
      title: state.subjectText,
      description: state.descriptionText,
      priority: state.ticketPriority,
      urgency: state.ticketUrgency,
    };

    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('test2='))
      .split('=')[1];

    const config = {
      authorization: cookieValue,
    };

    console.log('Ticket sent');
    try {
      const response = await axios.post(`${process.env.REACT_APP_TICKETS_URL}/create-ticket`, { email: auth.email, ticket }, config);
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };

  const clickHandler = async (event) => {
    event.preventDefault();
    setResponseStatus(await sendPostRequest());
    setState({ subjectText: ' ' });
    setState({ descriptionText: ' ' });
    setState({ ticketCategory: '' });
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
          <input id="subject-input" className="form-input" type="text" name="subjectText" value={state.subjectText || ''} onChange={handleChange} />
        </div>
        <div className="form-element">
          <label className="form-label" htmlFor="category-dropdown">
            <div className="label-text">Category</div>
          </label>
          <select id="category-dropdown" className="form-input" name="ticketCategory" value={state.ticketCategory} onChange={handleChange}>
            <option value="" disabled hidden>Select Category</option>
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
          <textarea id="description-textarea" className="form-input form-textarea" name="descriptionText" value={state.descriptionText} onChange={handleChange} />
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
    </>
  );
};
export default SubmitTicket;
