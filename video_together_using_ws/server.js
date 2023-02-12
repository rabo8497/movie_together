const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/video'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let state = {
  playing: true,
  currentTime: 0
};

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.send(JSON.stringify(state));

  socket.on('message', (message) => {
    const data = JSON.parse(message);
    state = { ...state, ...data };
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(state));
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});