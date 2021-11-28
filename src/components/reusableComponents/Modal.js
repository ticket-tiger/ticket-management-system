import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children }) => (
  <div className="modal">{children}</div>);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Modal;
