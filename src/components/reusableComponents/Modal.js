import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import closeModal from '../../images/close-modal.png';
import './Modal.css';

const Modal = ({ hideCloseModalButton, close, children }) => (
  <div className="modal-background">
    <div className="modal">
      <FontAwesomeIcon
        className={`modal-close-x ${hideCloseModalButton ? 'display-none' : ''}`}
        icon={faTimes}
        size="3x"
        onClick={close}
      />
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  hideCloseModalButton: PropTypes.bool,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Modal.defaultProps = {
  hideCloseModalButton: true,
};

export default Modal;
