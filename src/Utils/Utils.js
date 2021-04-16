export const allCellsEqual = arr =>
  arr.every(cell => cell.isVisible && cell.isCircle === arr[0].isCircle);

export const getRows = squareGrid => {
  const ROW_LENGTH = Math.sqrt(squareGrid.length);
  let rows = [];
  for (let i = 0; i < squareGrid.length; i += ROW_LENGTH) {
    const row = [];
    for (let j = i; j < i + ROW_LENGTH; j++) row.push(squareGrid[j]);
    rows.push(row);
  }
  return rows;
};

export const getColumns = squareGrid => {
  const COLUMN_LENGTH = Math.sqrt(squareGrid.length);
  let columns = [];
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const column = [];
    for (let j = i; j < squareGrid.length; j += COLUMN_LENGTH)
      column.push(squareGrid[j]);
    columns.push(column);
  }
  return columns;
};

export const getDiagonals = squareGrid => {
  const ROW_LENGTH = Math.sqrt(squareGrid.length);
  const leftDiagonals = [];
  for (let i = 0; i < squareGrid.length; i += ROW_LENGTH + 1)
    leftDiagonals.push(squareGrid[i]);
  const rightDiagonals = [];
  for (let i = ROW_LENGTH - 1; i < squareGrid.length - 1; i += ROW_LENGTH - 1)
    rightDiagonals.push(squareGrid[i]);
  return [[...leftDiagonals], [...rightDiagonals]];
};

export const formatName = name =>
  `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

export const makeid = length => {
  var result = '';
  var letters = 'ABCDEFGHIJKLMONPQRSTUVWXYZ';
  var numbers = '0123456789';
  var characters = `${letters}${letters.toLowerCase()}${numbers}`;
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createAudioBuffer = async (arrayBuffer, audioContext) => {
  return new Promise(resolve => {
    audioContext.decodeAudioData(arrayBuffer, buffer => resolve(buffer));
  });
};

// TODO: Probably use a dumb API like SWAPI to make it happen.
export const getRandomAIName = () => {
  return 'Dr. Jones';
};
