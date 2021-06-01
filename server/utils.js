const { v4: uuidv4 } = require('uuid');

const originIsAllowed = () => {
  // TODO: Determine what origin is allowed.
  return true;
};

const isValidRequest = request => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      `[${new Date()}] Connection from origin ${request.origin} rejected.`,
    );
    return false;
  }
  return true;
};

const getUniqueId = () => uuidv4();

const makeid = length => {
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

const log = message => console.log(`${new Date()}: ${message}!`);

module.exports = { originIsAllowed, getUniqueId, isValidRequest, makeid, log };
