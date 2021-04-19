import React, { useState, useEffect, useReducer } from 'react';
import Legend from '../Legend/Legend';
import BoardSettings from '../BoardSettings/BoardSettings';
import Grid from '../Grid/Grid';
import { OpponentType } from '../Utils/Constants';
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
  ADD_AI_PLAYER,
} from '../reducers';
import './Board.css';
import { SocketContextProvider } from '../SocketContext';

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
  const [numOfGames, setNumOfGames] = useState(0);

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

  const handleSwitchTurn = index => {
    const cell = grid[index];
    if (!cell.isVisible) {
      dispatch({ type: SWITCH_TURN });
    }
  };

  const handleCellClick = index => {
    if (isPlaying) {
      handleSwitchTurn(index);
      handleSetGrid(index);
    }
  };

  const handleNext = opponentType => {
    if (opponentType === OpponentType.LOCAL) {
      if (!numOfGames) {
        setOverlayMessage('Assign yourselves names!');
        setNumOfGames(prevValue => prevValue + 1);
        setIsConfiguring(true);
      } else {
        setButtonMessage('start');
        handleStart();
      }
    } else if (opponentType === OpponentType.ONLINE) {
      setOverlayMessage('Waiting on your opponent...');
      setIsConfiguring(true);
      // BoardSettings should turn into a lobby.
      // User should be marked as having joined lobby.
      // Opponent should be marked as pending to join until they've joined.
      // Button should indicate 'Waiting' and be disabled while we wait.
    }
    // AI
    else {
      setButtonMessage('start');
      setOverlayMessage('Assign yourself a name!');
      dispatch({ type: ADD_AI_PLAYER, payload: true });
      setIsConfiguring(true);
    }
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

  const getCurrentPlayer = () => playerList.find(player => player.hasTurn);

  return (
    <SocketContextProvider>
      <section className='board'>
        <Grid
          isPlaying={isPlaying}
          currentPlayer={getCurrentPlayer()}
          onCellClick={handleCellClick}
        >
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
          {playerList.filter(player => !player.isAI)}
        </BoardSettings>
        <Legend isPlaying={isPlaying}>{playerList}</Legend>
      </section>
    </SocketContextProvider>
  );
};

export default Board;
