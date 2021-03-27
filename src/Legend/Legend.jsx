import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Legend.css';

const Legend = ({ isPlaying, children }) => {
  const setVisibility = hasTurn =>
    isPlaying && hasTurn ? 'active' : 'disabled';

  const getIcon = isCircle =>
    isCircle ? (
      <FontAwesomeIcon icon={faCircle} />
    ) : (
      <FontAwesomeIcon icon={faTimes} />
    );

  return (
    <div className='legend'>
      {children.map((player, index) => (
        <div
          key={index}
          className={`player player${index + 1} ${setVisibility(
            player.hasTurn,
          )}`}
        >
          PLAYER {index + 1} {getIcon(player.isCircle)}
        </div>
      ))}
    </div>
  );
};

export default Legend;
