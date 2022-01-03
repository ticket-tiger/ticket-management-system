import React from 'react';
import PropTypes from 'prop-types';
import closeModal from '../../images/close-modal.png';
import './Modal.css';

const Modal = ({ hideCloseModalButton, close, children }) => (
  <div className="modal-background">
    <div className="modal">

      <button className={`modal-close-button ${hideCloseModalButton ? 'display-none' : ''}`} type="button" onClick={close}>
        <img className="modal-close-image" src={closeModal} alt="Close Modal" />
      </button>
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  hideCloseModalButton: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
