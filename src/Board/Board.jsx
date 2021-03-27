import React, { useState, useEffect, Fragment } from 'react';
import Cell from '../Cell';
import Legend from '../Legend/Legend';
import {
  allCellsEqual,
  getColumns,
  getDiagonals,
  getRows,
} from '../Utils/Utils';
import './Board.css';

const OpponentType = {
  AI: 0,
  HUMAN: 1,
};

const Board = () => {
  const [grid, setGrid] = useState(
    Array(9).fill({ isCircle: false, isVisible: false }),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [opponent, setOpponent] = useState(OpponentType.HUMAN);
  const [playerList, setPlayerList] = useState([]);
  const [overlayMessage, setOverlayMessage] = useState('Wanna play a game?');
  const [buttonMessage, setButtonMessage] = useState('Start');

  useEffect(() => {
    setPlayerList([
      { isPlayerOne: true, isCircle: false, hasTurn: true },
      { isPlayerOne: false, isCircle: true, hasTurn: false },
    ]);
  }, []);

  useEffect(() => {
    const hasWin = grouping => grouping.some(group => allCellsEqual(group));
    const gameTied = () => grid.every(cell => cell.isVisible);

    const reset = () => {
      setIsPlaying(false);
      setGrid(Array(9).fill({ isCircle: false, isVisible: false }));
    };

    const winnerExists = () =>
      hasWin(getDiagonals(grid)) ||
      hasWin(getRows(grid)) ||
      hasWin(getColumns(grid));

    const getWinner = () => {
      const playerNum = playerList.findIndex(player => !player.hasTurn);
      return `Player ${playerNum + 1} has won!`;
    };

    if (isPlaying) {
      if (winnerExists()) {
        setOverlayMessage(getWinner());
        setButtonMessage('Play again');
        reset();
      }

      if (gameTied()) {
        setOverlayMessage('Game tied!');
        setButtonMessage('Play again');
        reset();
      }
    }
  }, [grid, isPlaying, playerList]);

  const handleSetGrid = index => {
    const gridCopy = [...grid].map((cell, cellIndex) => {
      if (cellIndex === index) {
        return {
          ...cell,
          isVisible: true,
        };
      } else {
        if (!cell.isVisible) {
          return {
            ...cell,
            isCircle: !cell.isCircle,
          };
        }
      }
      return cell;
    });
    setGrid(gridCopy);
  };

  const handleSetPlayerList = () => {
    const playerListCopy = [...playerList].map(player => {
      return {
        ...player,
        hasTurn: !player.hasTurn,
      };
    });
    setPlayerList(playerListCopy);
  };

  const handleCellClick = index => {
    handleSetPlayerList();
    handleSetGrid(index);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setGrid(Array(9).fill({ isCircle: false, isVisible: false }));
    setPlayerList([
      { isPlayerOne: true, isCircle: false, hasTurn: true },
      { isPlayerOne: false, isCircle: true, hasTurn: false },
    ]);
  };

  const onValueChange = ({ target }) => setOpponent(parseInt(target.value));

  return (
    <Fragment>
      <section className='board'>
        <div className={`table ${isPlaying ? '' : 'disabled'}`}>
          {grid.map((cell, index) => (
            <Cell
              key={index}
              isCircle={cell.isCircle}
              isVisible={cell.isVisible}
              onClick={() => handleCellClick(index)}
            />
          ))}
        </div>
        <div className={`overlay-box ${isPlaying ? 'disabled' : ''}`}>
          <div className='text'>{overlayMessage}</div>
          <form className='board-settings'>
            <label htmlFor='ai'>
              <input
                id='ai'
                type='radio'
                name='opponentType'
                value={OpponentType.AI}
                onChange={onValueChange}
                checked={opponent === OpponentType.AI}
              />
              <span className='board-settings-text'>Play against AI</span>
            </label>
            <label htmlFor='human'>
              <input
                id='human'
                type='radio'
                name='opponentType'
                value={OpponentType.HUMAN}
                onChange={onValueChange}
                checked={opponent === OpponentType.HUMAN}
              />
              <span className='board-settings-text'>Play with someone</span>
            </label>
          </form>
          <div className='button' onClick={handleStart}>
            {buttonMessage}
          </div>
        </div>
      </section>
      <Legend isPlaying={isPlaying}>{playerList}</Legend>
    </Fragment>
  );
};

export default Board;
