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
      <div className = 'submit-ticket'>
         <div>What is the issue you are currently having?
            <FormTicket/>
            <button
               //className = 'submit-ticket__button' 
               onClick ={{clickHandler}}>
               Submit
            </button>
         </div>
      </div>
   );
}
export default SubmitTicket;