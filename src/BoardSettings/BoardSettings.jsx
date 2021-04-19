import React, { useState, Fragment, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { OpponentType } from '../Utils/Constants';
import './BoardSettings.css';
import Tooltip from '../Tooltip';
import { SocketContext } from '../SocketContext';

const BoardSettings = ({
  isPlaying,
  isConfiguring,
  onSubmit,
  overlayMessage,
  buttonMessage,
  handleNameChange,
  children,
}) => {
  const { gameCode, generateLobby } = useContext(SocketContext);
  const [opponent, setOpponent] = useState(OpponentType.LOCAL);
  const [copyGameCodeText, setCopyGameCodeText] = useState('Copy Game Code');

  const copyToClipboard = () => {
    setCopyGameCodeText('Copied Game Code!');
    navigator.clipboard.writeText(gameCode);
  };

  const getOpponentText = type => {
    if (type === 'LOCAL' || type === 'ONLINE') {
      return `2-player ${type.toLowerCase()}`;
    }
    return `Play against ${type}`;
  };

  const handleOnSumbit = () => {
    onSubmit(opponent);
  };

  const handleOpponentChange = e => {
    generateLobby();
    setOpponent(parseInt(e.target.value));
  };

  return (
    <div className={`overlay-box ${isPlaying ? 'disabled' : ''}`}>
      <div className='text'>{overlayMessage}</div>
      <div className='board-settings'>
        {!isConfiguring && (
          <Fragment>
            <div className='board-settings-options'>
              {Object.keys(OpponentType).map((type, index) => (
                <label key={`opponent-${index}`} htmlFor={type.toLowerCase()}>
                  <input
                    id={type.toLowerCase()}
                    type='radio'
                    name='opponentType'
                    value={OpponentType[type]}
                    onChange={e => handleOpponentChange(e)}
                    checked={opponent === OpponentType[type]}
                  />
                  <span className='board-settings-text'>
                    {getOpponentText(type)}
                  </span>
                </label>
              ))}
            </div>
            {opponent === OpponentType.ONLINE && (
              <div className='online'>
                <Fragment>
                  <input
                    className='code-input'
                    type='text'
                    value={gameCode}
                    readOnly
                  />
                  <Tooltip text={copyGameCodeText}>
                    <div
                      id='clipboard'
                      className='clipboard-copy'
                      onClick={copyToClipboard}
                    >
                      <FontAwesomeIcon icon={faClipboard} />
                    </div>
                  </Tooltip>
                </Fragment>
              </div>
            )}
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
        <div className='button' onClick={handleOnSumbit}>
          {buttonMessage}
        </div>
      </div>
    </div>
  );
};

export default BoardSettings;
