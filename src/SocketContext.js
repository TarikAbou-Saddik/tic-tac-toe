import React, { createContext, useState, useEffect } from 'react';

const SocketContext = createContext();
const socket = new WebSocket('ws://localhost:8000');

const SocketContextProvider = ({ children }) => {
  const [id, setId] = useState('');
  const [gameCode, setGameCode] = useState('');

  useEffect(() => {
    socket.onmessage = ({ data }) => {
      const jsonData = JSON.parse(data);
      setId(jsonData.id);
      if (jsonData.type === 'gamecode') {
        handleLobbyInit(jsonData);
      }
    };
  }, []);

  const generateSocketRequest = (type, payload = null, id = null) => {
    return {
      type,
      payload,
      id,
      date: Date.now(),
    };
  };

  const generateLobby = () => {
    socket.send(JSON.stringify(generateSocketRequest('gamecode')));
  };

  const handleLobbyInit = resp => {
    setGameCode(resp.payload);
  };

  return (
    <SocketContext.Provider value={{ id, gameCode, generateLobby }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };
