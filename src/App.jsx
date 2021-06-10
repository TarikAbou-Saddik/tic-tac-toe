import React from 'react';
import Board from './Board/Board';
import Header from './Header/Header';
import { SocketContextProvider } from './SocketContext';

const App = () => {
  return (
    <SocketContextProvider>
      <Header />
      <Board />
    </SocketContextProvider>
  );
};

export default App;
