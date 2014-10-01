var ws = require('ws')
  , WebSocketServer = ws.Server
  , wss = new WebSocketServer({ port: 8080 })
  , openSockets = []
  , socketCount = 0
  ;

function send (ws, data, errorCallback) {
  return ws.send(JSON.stringify(data), errorCallback);
}

function sendAll (data, except, errorCallback) {
  openSockets.forEach(function (ws, id) {
    if (!ws || id === except) {
      return;
    }

    send(ws, data, errorCallback);
  });
}

function decodeMessage (data) {
  try {
    data = JSON.parse(data);
  } catch (_error) {
  }
  return data;
}

wss.on("connection", function (ws) {
  var id = socketCount++
    , interval = setInterval(function () {
      send(ws, { type: "keepalive" }, function (_error) {})
    }, 15000);

  console.log("ws connection open");

  openSockets[id] = ws;

  ws.on("close", function () {
    console.log("ws connection close");
    openSockets[id] = undefined;
    clearInterval(interval);
  });

  ws.on("message", function (data, _flags) {
    data = decodeMessage(data);
    if (!data.message) {
      return;
    }

    console.log("ws message", data.message);

    sendAll(data, id);
  });
});
