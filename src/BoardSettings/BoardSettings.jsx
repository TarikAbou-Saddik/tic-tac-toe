import { useState, Fragment, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { OpponentType, GameState } from '../Utils/Constants';
import { SocketContext } from '../SocketContext';
import Tooltip from '../Tooltip';
import './BoardSettings.css';

const BoardSettings = ({
  isPlaying,
  onSubmit,
  overlayMessage,
  buttonMessage,
  handleNameChange,
  children,
}) => {
  const { gameCode, opponent, handleOpponentChange, currentGameState } =
    useContext(SocketContext);
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

  const renderOnSubmit = (
    <div className={`button ${true && 'active'}`} onClick={onSubmit}>
      {buttonMessage}
    </div>
  );

  const renderMenuOptions = (
    <Fragment>
      <div className='board-settings-options'>
        {Object.keys(OpponentType).map((type, index) => (
          <label key={`opponent-${index}`} htmlFor={type.toLowerCase()}>
            <input
              id={type.toLowerCase()}
              type='radio'
              name='opponentType'
              value={OpponentType[type]}
              onChange={e => handleOpponentChange(e.target.value)}
              checked={opponent === OpponentType[type]}
            />
            <span className='board-settings-text'>{getOpponentText(type)}</span>
          </label>
        ))}
      </div>
      {renderOnSubmit}
    </Fragment>
  );

  const renderOnlineMenuOptions = (
    <Fragment>
      <div className='button' onClick={onSubmit}>
        Create game
      </div>
      <div className='button' onClick={onSubmit}>
        Join game
      </div>
    </Fragment>
  );

  // TODO: Refactor this so it takes into account waiting in lobby for a player to join.
  const renderPlayers = children.map((player, index) => (
    <div className='player-input-container'>
      <input
        key={index}
        type='text'
        value={player.name}
        onChange={e => handleNameChange(index, e.target.value)}
        className='player-name-input'
      />
      <FontAwesomeIcon className='check-circle' icon={faCheckCircle} />
    </div>
  ));

  const renderLocalLobby = (
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
      {renderOnSubmit}
    </Fragment>
  );

  const renderOnlineLobby = (
    <Fragment>
      {/* TODO: Render local player and spot for player joining. Render both if both are connected. */}
      {renderPlayers}
      {opponent === OpponentType.ONLINE && (
        <div className='online'>
          <input className='code-input' type='text' value={gameCode} readOnly />
          <Tooltip text={copyGameCodeText}>
            <div
              id='clipboard'
              className='clipboard-copy'
              onClick={copyToClipboard}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </div>
          </Tooltip>
        </div>
      )}
      {renderOnSubmit}
    </Fragment>
  );

  const renderContent = () => {
    switch (currentGameState) {
      case GameState.MENU:
        return renderMenuOptions;
      case GameState.ASSIGN_PLAYER_NAMES:
        return renderLocalLobby;
      case GameState.CONFIG_SETTINGS_ONLINE:
        return renderOnlineMenuOptions;
      case GameState.WAIT_IN_LOBBY_ONLINE:
        return renderOnlineLobby;
      case GameState.WAIT_TO_CONNECT_ONLINE:
        return <h1>Not yet implemented...</h1>;
      default:
        return renderMenuOptions;
    }
  };

  return (
    <div className={`overlay-box ${isPlaying ? 'disabled' : ''}`}>
      <div className='text animated-overlay'>{overlayMessage}</div>
      <div className='board-settings'>{renderContent()}</div>
    </div>
  );
};

export default BoardSettings;
