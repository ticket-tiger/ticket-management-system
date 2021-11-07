import React,{useState, useEffect} from 'react';
import axios from 'axios';
import './TicketLog.css';
import SubmitTicket from '../SubmitTicket/SubmitTicket';

const TicketLog = () => {
   
   useEffect(() => {
   //   getTickets()
   },[])
   
   const sendTicketText = async () => {
      const response = await axios.get('http://localhost:3001/api/get-tickets',
   {
      
   })
   };
   return
   (
   //This function is waiting for the server to send ticket data from the server

      <div/>
   );
}
export default TicketLog;