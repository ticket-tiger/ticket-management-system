import React from 'react';
import './SubmitTicket.css';
import FormTicket from './FormTicket';
const SubmitTicket = () => 
{
   const clickHandler =() => 
   {
      console.log('Clicked')
   };
   return (
      <div class = 'submit-ticket'>
         <div class = 'title'>Describe your issue </div>
         <FormTicket/>
         <button
            class = 'submit-ticket__button' 
            onClick ={{clickHandler}}>
            Submit
         </button>
         
      </div>
   );
}
export default SubmitTicket;