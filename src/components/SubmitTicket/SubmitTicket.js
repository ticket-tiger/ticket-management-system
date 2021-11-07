import React from 'react';
import './SubmitTicket.css';
import FormTicket from './FormTicket';

const SubmitTicket = () => {
  const clickHandler = () => {
    console.log('Clicked');
  };
  return (
    <div className="submit-ticket">
      <div className="title">Describe your issue </div>
      <FormTicket />
      <button type="submit" className="submit-ticket__button" onClick={{ clickHandler }}>
        Submit
      </button>

    </div>
  );
};
export default SubmitTicket;
