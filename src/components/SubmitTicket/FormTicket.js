import React from 'react';
import './FormTicket.css';

function FormTicket() {
  return (
    <form>
      <label>
        <textarea type="text" rows="10" cols="25" />
      </label>
    </form>
  );
}
// ReactDOM.render(<FormTicket/>, document.getElementById('root'));
export default FormTicket;
