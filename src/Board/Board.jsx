import React, { useState, useEffect, Fragment, useReducer } from 'react';
import Legend from '../Legend/Legend';
import BoardSettings from '../BoardSettings/BoardSettings';
import Grid from '../Grid/Grid';
import {
  allCellsEqual,
  getColumns,
  getDiagonals,
  getRows,
} from '../Utils/Utils';
import {
  playerListReducer,
  initialPlayerList,
  initialGrid,
  SET_NAME,
  SWITCH_TURN,
  RESET_PLAYER_TURN,
} from '../reducers';
import './Board.css';

const Board = () => {
  const [grid, setGrid] = useState(initialGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('Wanna play a game?');
  const [buttonMessage, setButtonMessage] = useState('next');
  const [playerList, dispatch] = useReducer(
    playerListReducer,
    initialPlayerList(),
  );

  useEffect(() => {
    const hasWin = grouping => grouping.some(group => allCellsEqual(group));
    const gameTied = () => grid.every(cell => cell.isVisible);

    const reset = () => {
      setIsPlaying(false);
      setGrid(initialGrid());
      dispatch({ type: RESET_PLAYER_TURN });
      setButtonMessage('Play again');
    };

    const winnerExists = () =>
      hasWin(getDiagonals(grid)) ||
      hasWin(getRows(grid)) ||
      hasWin(getColumns(grid));

    const getWinner = () => {
      const player = playerList.find(player => !player.hasTurn);
      return `${player.name.toUpperCase()} has won!`;
    };

    if (isPlaying) {
      if (winnerExists()) {
        setOverlayMessage(getWinner());
        reset();
      }

      if (gameTied()) {
        setOverlayMessage('Game tied!');
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

  const handleCellClick = index => {
    if (isPlaying) {
      dispatch({ type: SWITCH_TURN });
      handleSetGrid(index);
    }
  };

  const handleNext = () => {
    setIsConfiguring(true);
    setButtonMessage('start');
    setOverlayMessage('Assign yourselves names!');
  };

  const handleStart = () => {
    setIsConfiguring(false);
    setIsPlaying(true);
    setGrid(initialGrid());
  };

  const handlePlayerNameChange = (playerIndex, name) => {
    const isPlayerOne = !Boolean(playerIndex);
    const payload = { isPlayerOne, name };
    dispatch({ type: SET_NAME, payload });
  };

  return (
    <Fragment>
      <section className='board'>
        <Grid isPlaying={isPlaying} onCellClick={handleCellClick}>
          {grid}
        </Grid>
        <BoardSettings
          isPlaying={isPlaying}
          isConfiguring={isConfiguring}
          onSubmit={isConfiguring ? handleStart : handleNext}
          overlayMessage={overlayMessage}
          buttonMessage={buttonMessage}
          handleNameChange={handlePlayerNameChange}
        >
          {playerList}
        </BoardSettings>
        <Legend isPlaying={isPlaying}>{playerList}</Legend>
      </section>
    </Fragment>
  );
};

export default Board;
