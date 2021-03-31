// State
export const initialGrid = () =>
  Array(9).fill({ isCircle: false, isVisible: false });

export const initialPlayerList = () => [
  { isPlayerOne: true, isCircle: false, hasTurn: true, name: 'Player 1' },
  { isPlayerOne: false, isCircle: true, hasTurn: false, name: 'Player 2' },
];

// Actions
export const SET_NAME = 'SET_NAME';
export const SWITCH_TURN = 'SWITCH_TURN';
export const RESET_PLAYER_TURN = 'RESET_PLAYER_TURN';

// Reducers
export const playerListReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_NAME:
      const { isPlayerOne, name } = payload;
      return getStateCopy(state, player => {
        if (player.isPlayerOne === isPlayerOne) {
          return {
            ...player,
            name,
          };
        }
        return player;
      });
    case SWITCH_TURN:
      return getStateCopy(state, player => {
        return {
          ...player,
          hasTurn: !player.hasTurn,
        };
      });
    case RESET_PLAYER_TURN:
      return getStateCopy(state, player => {
        if (player.isPlayerOne) {
          return {
            ...player,
            hasTurn: true,
          };
        }
        return {
          ...player,
          hasTurn: false,
        };
      });
    default:
      return state;
  }
};

// Helper methods
const getStateCopy = (state, callback) => state.map(callback);
