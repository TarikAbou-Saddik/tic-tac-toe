import React, { useState, Fragment } from 'react';
import './BoardSettings.css';

const OpponentType = {
  AI: 0,
  HUMAN: 1,
};

const BoardSettings = ({
  isPlaying,
  isConfiguring,
  onSubmit,
  overlayMessage,
  buttonMessage,
  handleNameChange,
  children,
}) => {
  const [opponent, setOpponent] = useState(OpponentType.HUMAN);

  const onValueChange = ({ target }) => setOpponent(parseInt(target.value));
  return (
    <div className={`overlay-box ${isPlaying ? 'disabled' : ''}`}>
      <div className='text'>{overlayMessage}</div>
      <div className='board-settings'>
        {!isConfiguring && (
          <Fragment>
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
          </Fragment>
        )}
        {isConfiguring && (
          <Fragment>
            {children.map((player, index) => (
              <input
                key={index}
                type='text'
                value={player.name}
                onChange={e => handleNameChange(index, e.target.value)}
                className='player-name-input'
              />
            ))}
          </Fragment>
        )}
        <div className='button' onClick={onSubmit}>
          {buttonMessage}
        </div>
      </div>
    </div>
  );
};

export default BoardSettings;
