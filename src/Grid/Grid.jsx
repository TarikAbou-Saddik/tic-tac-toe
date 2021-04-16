import React, { useEffect, useCallback } from 'react';
import Cell from '../Cell';
import TapCellAudioSrc from '../assets/TapCell.mp3';
import { useAudio } from '../hooks/useAudio';
import './Grid.css';

const Grid = ({ children, isPlaying, currentPlayer, onCellClick }) => {
  const [playAudio] = useAudio(TapCellAudioSrc);

  const onClick = useCallback(
    index => {
      if (isPlaying) {
        playAudio();
        onCellClick(index);
      }
    },
    [isPlaying, playAudio, onCellClick],
  );

  useEffect(() => {
    const availableCells = children.filter(cell => !cell.isVisible);
    const getRandomCellIndex = () => {
      const randomIndex =
        Math.round(Math.random() * 10) % availableCells.length;
      return availableCells[randomIndex].index;
    };

    if (currentPlayer.isAI && isPlaying) {
      if (availableCells.length > 0) {
        const timeoutId = setTimeout(() => onClick(getRandomCellIndex()), 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentPlayer, isPlaying, children, onClick]);

  return (
    <div className={`table ${isPlaying ? '' : 'disabled'}`}>
      {children.map((cell, index) => (
        <Cell
          key={index}
          isCircle={cell.isCircle}
          isVisible={cell.isVisible}
          onClick={() => onClick(index)}
        />
      ))}
    </div>
  );
};

export default Grid;
