import React from 'react';
import Cell from '../Cell';
import './Grid.css';

const Grid = ({ children, isPlaying, onCellClick }) => {
  return (
    <div className={`table ${isPlaying ? '' : 'disabled'}`}>
      {children.map((cell, index) => (
        <Cell
          key={index}
          isCircle={cell.isCircle}
          isVisible={cell.isVisible}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
};

export default Grid;
