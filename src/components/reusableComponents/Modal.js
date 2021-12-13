import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ closeForm, children }) => (
  <div className="modal">
    {children}
    <button type="button" onClick={closeForm}>
      Close
    </button>
  </div>
);

Modal.propTypes = {
  closeForm: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
