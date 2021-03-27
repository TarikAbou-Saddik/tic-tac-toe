// import React from 'react';
// import './BoardSettings.css';

// const BoardSettings = ({ isPlaying }) => {
//   return (
//     <div className={`overlay-box ${isPlaying ? 'disabled' : ''}`}>
//       <div className='text'>Wanna play a game?</div>
//       <form className='board-settings'>
//         <label htmlFor='ai'>
//           <input
//             id='ai'
//             type='radio'
//             value={OpponentType.AI}
//             onChange={onValueChange}
//             checked={opponent === OpponentType.AI}
//           />
//           <span className='board-settings-text'>Play against AI</span>
//         </label>
//         <label htmlFor='human'>
//           <input
//             id='human'
//             type='radio'
//             value={OpponentType.HUMAN}
//             onChange={onValueChange}
//             checked={opponent === OpponentType.HUMAN}
//           />
//           <span className='board-settings-text'>Play with someone</span>
//         </label>
//       </form>
//       <div className='button' onClick={handleStart}>
//         START
//       </div>
//     </div>
//   );
// };

// export default BoardSettings;
