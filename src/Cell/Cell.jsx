import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Cell.css';

const Cell = ({ isCircle, isVisible, onClick }) => {
  return (
    <div className={`cell`} onClick={onClick}>
      {isCircle
        ? isVisible && <FontAwesomeIcon icon={faCircle} color='yellow' />
        : isVisible && <FontAwesomeIcon icon={faTimes} color='lightblue' />}
    </div>
  );
};

export default Cell;
