import React, { useState } from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => {
  const [ticketText, setTicketText] = useState('');

  const submitHandler = () => {
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
    <table>

      <tr>What is the issue you are currently having?</tr>
      <td>
        <textarea type="text" onInput={(e) => setTicketText(e.target.value)} value ="text-description" />
      </td>
      <tr />
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
      <tr>
        <div>
          <button type="submit" onClick={clickHandler2}>
            Cancel
          </button>
          <button
            type="submit"
                  // className = 'submit-ticket__button'
            onClick={{ submitHandler }}
          >
            Submit
          </button>
        </div>
      </tr>
    </table>
  );
};
export default SubmitTicket;
