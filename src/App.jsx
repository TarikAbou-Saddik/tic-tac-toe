import React from 'react';
import './App.css';
import Board from './Board/Board';
import Header from './Header/Header';

const App = () => {
  return (
    <div className='app'>
      <Header />
      <Board />
    </div>
  );
};

export default App;
