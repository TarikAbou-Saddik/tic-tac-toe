import React from 'react';
import './Tooltip.css';

const Tooltip = ({ children, text }) => {
  return (
    <div className='tooltip'>
      {children} <span className='tooltiptext'>{text}</span>
    </div>
  );
};

export default Tooltip;
