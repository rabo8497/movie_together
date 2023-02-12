const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/video'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('seek', (time) => {
        socket.broadcast.emit('seek', time);
    });

    socket.on('play', () => {
        socket.broadcast.emit('play');
    });

    socket.on('pause', () => {
        socket.broadcast.emit('pause');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
