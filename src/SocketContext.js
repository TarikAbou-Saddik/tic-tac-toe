import { createContext, useState, useEffect, useRef } from 'react';
import { OpponentType, GameState } from './Utils/Constants';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const socket = useRef(null);
  const [id, setId] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [opponent, setOpponent] = useState(OpponentType.LOCAL);
  const [currentGameState, setCurrentGameState] = useState(GameState.MENU);

  useEffect(() => {
    const cleanUp = () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
    if (opponent === OpponentType.ONLINE) {
      if (!socket.current) {
        socket.current = new WebSocket('ws://localhost:8000');
      }
      socket.current.onmessage = ({ data }) => {
        const jsonData = JSON.parse(data);
        setId(jsonData.id);
        if (jsonData.type === 'gamecode') {
          setGameCode(jsonData.payload);
        }
      };
    } else {
      cleanUp();
    }
  }, [opponent]);

  const generateSocketRequest = (type, payload = null, id = null) => {
    return {
      type,
      payload,
      id,
      date: Date.now(),
    };
  };

  const generateLobby = () => {
    if (socket.current) {
      socket.current.send(JSON.stringify(generateSocketRequest('gamecode')));
    }
  };

  const handleOpponentChange = opponentType => {
    setOpponent(parseInt(opponentType));
  };

  const isLocalOpponent = () => opponent === OpponentType.LOCAL;

  const isOnlineOpponent = () => opponent === OpponentType.ONLINE;

  return (
    <SocketContext.Provider
      value={{
        id,
        gameCode,
        opponent,
        currentGameState,
        isLocalOpponent,
        isOnlineOpponent,
        handleOpponentChange,
        generateLobby,
        setCurrentGameState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
