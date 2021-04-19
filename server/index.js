const WebSocketServer = require('websocket').server;
const createServer = require('http').createServer;
const { getUniqueId, isValidRequest, makeid } = require('./utils');

const WEB_SOCKET_PORT = 8000;

const server = createServer(request => {
  console.log(`[${new Date()}] Received request for ${request.url}`);
});

server.listen(WEB_SOCKET_PORT, () =>
  console.log(`Server is listening on port ${WEB_SOCKET_PORT}`),
);

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const clients = {};

wsServer.on('request', request => {
  if (!isValidRequest(request)) return;

  const userId = getUniqueId();
  const connection = request.accept(null, request.origin);
  clients[userId] = connection;

  connection.on('message', message => {
    if (message.type === 'utf8') {
      let [type, response] = generateResponse(message);

      if (type === 'gamecode') {
        response = {
          ...response,
          type: 'gamecode',
          payload: makeid(6),
        };
      }
      clients[userId].sendUTF(JSON.stringify(response));
    }
  });

  const generateResponse = message => {
    const data = JSON.parse(message.utf8Data);
    const response = {
      type: '',
      payload: null,
      id: userId,
      date: Date.now(),
    };
    return [data.type, response];
  };
});
