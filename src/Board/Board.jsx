import React, { useState, useEffect, useReducer, useContext } from 'react';
import Legend from '../Legend/Legend';
import BoardSettings from '../BoardSettings/BoardSettings';
import Grid from '../Grid/Grid';
import { SocketContext } from '../SocketContext';
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
import { GameState } from '../Utils/Constants';

const Board = () => {
  const {
    isLocalOpponent,
    isOnlineOpponent,
    currentGameState,
    generateLobby,
    setCurrentGameState,
  } = useContext(SocketContext);

  const [grid, setGrid] = useState(initialGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('Wanna play a game?');
  const [buttonMessage, setButtonMessage] = useState('next');
  const [numOfGames, setNumOfGames] = useState(0);
  const [playerList, dispatch] = useReducer(
    playerListReducer,
    initialPlayerList(),
  );

  useEffect(() => {
    const hasWin = grouping => grouping.some(group => allCellsEqual(group));
    const gameTied = () => grid.every(cell => cell.isVisible);

    const reset = () => {
      setCurrentGameState(GameState.GAME_COMPLETED);
      setIsPlaying(false);
      setGrid(initialGrid());
      dispatch({ type: RESET_PLAYER_TURN });
      // TODO: Offer option for player to select another mode.
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
  }, [grid, isPlaying, playerList, setCurrentGameState]);

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

  const handleNext = () => {
    if (isLocalOpponent()) {
      if (!numOfGames) {
        setOverlayMessage('Assign yourselves names!');
        setNumOfGames(prevValue => prevValue + 1);
        setCurrentGameState(GameState.ASSIGN_PLAYER_NAMES);
        setIsReadyToStart(true);
      } else {
        setButtonMessage('start');
        handleStart();
      }
    } else if (isOnlineOpponent()) {
      if (currentGameState === GameState.MENU) {
        generateLobby();
        setOverlayMessage('Play online with friends.');
        setCurrentGameState(GameState.CONFIG_SETTINGS_ONLINE);
      } else if (currentGameState === GameState.CONFIG_SETTINGS_ONLINE) {
        setOverlayMessage('Waiting for player...');
        setCurrentGameState(GameState.WAIT_IN_LOBBY_ONLINE);
        setButtonMessage('start');
      } else {
        setIsReadyToStart(true);
      }
    }
    // AI
    else {
      setButtonMessage('start');
      setOverlayMessage('Assign yourself a name!');
      dispatch({ type: ADD_AI_PLAYER, payload: true });
      setCurrentGameState(GameState.ASSIGN_PLAYER_NAMES);
      setIsReadyToStart(true);
    }
  };

  const handleStart = () => {
    setIsReadyToStart(false);
    setIsPlaying(true);
    setCurrentGameState(GameState.GAME_IN_PROGRESS);
    setGrid(initialGrid());
  };

  const handlePlayerNameChange = (playerIndex, name) => {
    const isPlayerOne = !Boolean(playerIndex);
    const payload = { isPlayerOne, name };
    dispatch({ type: SET_NAME, payload });
  };

  const getCurrentPlayer = () => playerList.find(player => player.hasTurn);

  return (
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
        onSubmit={isReadyToStart ? handleStart : handleNext}
        overlayMessage={overlayMessage}
        buttonMessage={buttonMessage}
        handleNameChange={handlePlayerNameChange}
      >
        {playerList.filter(player => !player.isAI)}
      </BoardSettings>
      <Legend isPlaying={isPlaying}>{playerList}</Legend>
    </section>
  );
};

export default Board;
