import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth';
import './CreateTicket.css';

const CreateTicket = () => {
  const auth = useAuth();
  const [responseStatus, setResponseStatus] = useState(null);
  const [guestEmail, setGuestEmail] = useState(auth.email);
  const [state, setState] = useState({
    ticketCategory: '',
    ticketPriority: 'Low',
    ticketUrgency: 'Low',
    subjectText: '',
    descriptionText: '',
  });

  const handleChange = (e) => {
    const { value } = e.target;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const sendPostRequest = async () => {
    const ticket = {
      category: state.ticketCategory,
      title: state.subjectText,
      description: state.descriptionText,
      priority: state.ticketPriority,
      urgency: state.ticketUrgency,
    };

    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('Bearer '));

    const config = {
      authorization: cookieValue || null,
    };

    try {
      const response = await axios.post('/tickets/create-ticket', { email: guestEmail, ticket }, config);
      console.log(response);
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

  const clickHandler2 = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {/* <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1> */}
      {responseStatus ? <p data-testid="responseStatus">{responseStatus}</p> : null}
      <form className="form">
        <div className="form-element">
          <input id="subject-input" className="form-input" type="text" name="subjectText" value={state.subjectText || ''} onChange={handleChange} />
          <label className="form-label" htmlFor="subject-input">
            <div className="label-text">Subject</div>
          </label>
        </div>
        <div className="form-element">
          <select id="category-dropdown" className="form-input" name="ticketCategory" value={state.ticketCategory} onChange={handleChange}>
            <option value="" disabled hidden>Select Category</option>
            <option value="Vendor Issues">Vendor Issues</option>
            <option value="Pre-Order questions">Pre-order Questions</option>
            <option value="Shipping">Shipping</option>
            <option value="Returns">Returns</option>
            <option value="Other">Other</option>
          </select>
          <label className="form-label" htmlFor="category-dropdown">
            <div className="label-text">Category</div>
          </label>
        </div>
        <div className="form-element">
          <textarea id="description-textarea" className="form-input form-textarea" name="descriptionText" value={state.descriptionText} onChange={handleChange} />
          <label className="form-label" htmlFor="description-textarea">
            <div className="label-text">Description</div>
          </label>
        </div>
        {auth.email
          ? null
          : (
            <div className="form-element">
              <input id="create-ticket-email" className="form-input" onChange={(e) => setGuestEmail(e.target.value)} />
              <label className="form-label" htmlFor="create-ticket-email">Email</label>
            </div>
          )}
        <div className="form-button-group">
          <button className="form-button form-clear-button" type="button" onClick={(e) => clickHandler2(e)}>
            Clear
          </button>
          <button
            className="form-button form-submit-button"
            type="submit"
            onClick={(e) => clickHandler(e)}
          >
            Submit Your Issue
          </button>
        </div>
      </form>
    </>
  );
};
export default CreateTicket;
