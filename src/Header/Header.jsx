import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header>
      <h1 className='title'>Tic Tac Toe</h1>
      <p className='subtitle'>
        Seriously, when was the last time you actually played this?
      </p>
    </header>
  );
};

export default Header;
