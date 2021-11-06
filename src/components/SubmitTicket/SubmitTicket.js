import React,{useState} from 'react';
import axios from 'axios';
import './SubmitTicket.css';

const SubmitTicket = () => 
{
   // const sendTicketText = async () =>
   // {
   //    const response = await axios.get('http://localhost:3001/api/get-tickets',
   //    {
         
   //    })
   // };
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
   return (
      <div className = 'submit-ticket'>
            <form>What is the issue you are currently having?
               <label>
                  <textarea type = "text" onInput = {e => setTicketText(e.target.value)}/>
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