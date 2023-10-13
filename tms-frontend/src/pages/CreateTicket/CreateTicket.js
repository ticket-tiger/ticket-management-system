import React, { useState, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
//import {tiger} from './tiger.svg';
import validator from 'validator';
import axios from 'axios';
import { useAuth } from '../../auth';
import './CreateTicket.css';

const CreateTicket = () => {
  const auth = useAuth();
  const [responseStatus, setResponseStatus] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
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

  const ticketReducer = (reducerState, action) => {
    switch (action.type) {
      case 'subject':
        return {
          ...reducerState,
          subject: action.valid ? '' : 'noSubject',
          message: action.valid ? '' : 'Enter a subject.',
        };
      case 'category':
        return {
          ...reducerState,
          category: action.valid ? '' : 'noCategory',
          message: action.valid ? '' : 'Please select a category',
        };
      case 'description':
        return {
          ...reducerState,
          description: action.valid ? '' : 'noDescription',
          message: action.valid ? '' : 'Please describe your issue ',
        };
      case 'email':
        return {
          ...reducerState,
          email: action.valid ? '' : 'noEmail',
          message: action.valid ? '' : 'Please enter a valid email',
        };
      case 401:
        return {
          ...reducerState,
          message: action.valid ? '' : 'This email is in use.',
        };
      case 'noError':
        return {
          subject: '',
          category: '',
          description: '',
          email: '',
        };

      default:
        return {
          ...reducerState,
          message: 'There was an unexpected error. Please try again later',
        };
    }
  };

  const intialTicketError = {
    subject: '',
    email: '',
    category: '',
    description: '',
    message: '',
  };

  const [ticketErrorObject, ticketDispatch] = useReducer(ticketReducer, intialTicketError);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ticket = {
      category: state.ticketCategory,
      subject: state.subjectText,
      description: state.descriptionText,
      priority: state.ticketPriority,
      urgency: state.ticketUrgency,
    };
    try {
      // validate if other fields are empty
      const email = guestEmail || auth.user.email;
      if (validator.isEmpty(ticket.subject)) {
        ticketDispatch({ type: 'subject', valid: false });
        return;
      }
      ticketDispatch({ type: 'subject', valid: true });

      // category validation
      if (validator.isEmpty(ticket.category)) {
        ticketDispatch({ type: 'category', valid: false });
        return;
      }
      ticketDispatch({ type: 'category', valid: true });

      // description validation
      if (validator.isEmpty(ticket.description)) {
        ticketDispatch({ type: 'description', valid: false });
        return;
      }
      ticketDispatch({ type: 'description', valid: true });

      // email validation
      if (!validator.isEmail(guestEmail || auth.user.email)) {
        ticketDispatch({ type: 'email', valid: false });
        return;
      }
      ticketDispatch({ type: 'email', valid: true });

      const response = await axios.post('/tickets/create-ticket', { email, ticket });
      setResponseStatus(response.status);
      ticketDispatch({ type: 'noError' });
      console.log(response);
    } catch (error) {
      ticketDispatch({ type: error.response.status });
    }
    setState({ ticketCategory: '' });
    setState({ subjectText: ' ' });
    setState({ descriptionText: ' ' });
  };

  const clearClickHandler = (event) => {
    event.preventDefault();
    ticketDispatch({ type: 'noError' });
    setState({
      ticketCategory: '',
      ticketPriority: 'Low',
      ticketUrgency: 'Low',
      subjectText: '',
      descriptionText: '',
    });
  };

  return (
    <>
      <img src = "tiger.svg" alt="tiger logo"/>
      <div
        className={`ticket-submitted-feedback ${responseStatus === 200 ? 'fade' : ''}`}
        onAnimationEnd={() => setResponseStatus('')}
      >
        <FontAwesomeIcon className="ticket-submitted-check" icon={faCheck} size="2x" />
        <p className="ticket-submitted-text">Ticket Sent</p>
      </div>
      {/* <h1 className="submit-ticket-heading">Have an issue? Let us know.</h1> */}
      <p className="error-message-ticket">
        {ticketErrorObject.message}
      </p>
      <form className="form">
        <div className="form-element">
          <input id="subject-input" className={`form-input ${ticketErrorObject.subject}`} type="text" name="subjectText" value={state.subjectText || ''} onChange={handleChange} />
          <label className="form-label" htmlFor="subject-input">
            <div className="label-text">Subject</div>
          </label>
        </div>
        <div className="form-element">
          <select id="category-dropdown" className={`form-input ${ticketErrorObject.category}`} name="ticketCategory" value={state.ticketCategory} onChange={handleChange}>
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
          <textarea id="description-textarea" className={`form-input ${ticketErrorObject.description} form-input form-textarea`} name="descriptionText" value={state.descriptionText} onChange={handleChange} />
          <label className="form-label" htmlFor="description-textarea">
            <div className="label-text">Description</div>
          </label>
        </div>
        {auth.user.email
          ? null
          : (
            <div className="form-element">
              <input id="create-ticket-email" className={`form-input ${ticketErrorObject.email} form-input`} onChange={(e) => setGuestEmail(e.target.value)} />
              <label className="form-label" htmlFor="create-ticket-email">Email</label>
            </div>
          )}
        <div className="form-button-group">
          <button className="form-button form-clear-button" type="button" onClick={(e) => clearClickHandler(e)}>
            Clear
          </button>
          <button
            className="form-button form-submit-button"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit Your Issue
          </button>
        </div>
      </form>
    </>
  );
};
export default CreateTicket;
