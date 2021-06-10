const WebSocketServer = require('websocket').server;
const createServer = require('http').createServer;
const { getUniqueId, isValidRequest, makeid, log } = require('./utils');

const WEB_SOCKET_PORT = 8000;

// Create our HTTP server
const server = createServer(request => {
  console.log(`[${new Date()}] Received request for ${request.url}`);
});

// Add listener for HTTP server
server.listen(WEB_SOCKET_PORT, () =>
  console.log(`Server is listening on port ${WEB_SOCKET_PORT}`),
);

// Create our WebSocket and hook it into our HTTP server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// A hashmap of our connected users
const clients = {};

wsServer.on('request', request => {
  if (!isValidRequest(request)) return;

  const userId = getUniqueId();
  const connection = request.accept(null, request.origin);
  log(`Connection accepted from ${request.origin}!`);
  clients[userId] = {
    connection,
  };

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
      clients[userId].connection.sendUTF(JSON.stringify(response));
    }
  });

  connection.on('close', () =>
    log('WebSocket connection successfully closed!'),
  );

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
