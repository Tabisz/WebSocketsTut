const WebSocket = require('ws')
const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(path.resolve(__dirname, '../Client')))
const server = app.listen(9876,'192.168.0.241')

const wss = new WebSocket.Server({
    noServer: true,
})

 wss.on('connection', function(ws){
    ws.on('message', function(data){
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(data.toString());
            }
          });
        });
})

server.on('upgrade', async function upgrade(request, socket, head) {
  // Do what you normally do in `verifyClient()` here and then use
  // `WebSocketServer.prototype.handleUpgrade()`.
  let args;

  try {
    args = await getDataAsync();
  } catch (e) {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request, ...args);
  });
});


