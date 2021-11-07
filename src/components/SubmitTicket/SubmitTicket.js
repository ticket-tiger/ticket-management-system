import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';
// import TicketLog from '../TicketLog/TicketLog';

const SubmitTicket = () => {
  const [ticketText, setTicketText] = useState('');

  const clickHandler = () => {
    console.log('Clicked');
    axios.post('http://localhost:3001/api/create-ticket', ticketText,
      {
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickHandler2 = () => {

  };
  return (
    <div className="submit-ticket">
      <form>
        <p>What is the issue you are currently having?</p>
        <label>
          <textarea type="text" rows="10" cols="25" onInput={(e) => setTicketText(e.target.value)} />
        </label>
      </form>
      <div>
        <button type="submit" onClick={clickHandler2}>
          Cancel
        </button>
        <button
          type="submit"
                  // className = 'submit-ticket__button'
          onClick={{ clickHandler }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default SubmitTicket;
