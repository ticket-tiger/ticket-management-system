import React from 'react';
import './SubmitTicket.css';
import TicketLog from '../TicketLog/TicketLog';

const SubmitTicket = () => 
{
   const[ticketText, setTicketText] = useState('');
   
   const clickHandler =() => 
   {
      
      console.log('Clicked')
      axios.post('http://localhost:3001/api/create-ticket', ticketText,
      {
       })
       .catch(function (error) {
         console.log(error);
       });
   };
   const clickHandler2 = () =>
   {
      
   }
   return (
      <div className = 'submit-ticket'>
            <form>What is the issue you are currently having?
               <label>
                  <textarea type = "text" onInput = {e => setTicketText(e.target.value)}/>
               </label>
            </form>
            <div>
               <button onClick = {clickHandler2}>
                  Cancel
               </button>
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
