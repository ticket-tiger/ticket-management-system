import React from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => 
{
   const clickHandler =() => 
   {
      console.log('Clicked')
   };
   return (
      <div className = 'submit-ticket'>
            <form>What is the issue you are currently having?
               <label>
                  <textarea type = "text" />
               </label>
            </form>
            <button
               //className = 'submit-ticket__button' 
               onClick ={{clickHandler}}>
               Submit
            </button>
      </div>
   );
}
export default SubmitTicket;