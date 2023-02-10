const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let current_time = 0; 
let is_play = false;
let vid_link;
app.use(express.static(__dirname + '/video'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('video_change', (link) => {
        vid_link = link
        socket.broadcast.emit('video_change_from_server', link);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('seek', (time) => {
        current_time = time
        socket.broadcast.emit('seek', time);
    });

    socket.on('play', (time) => {
        is_play = true
        current_time = time
        socket.broadcast.emit('play');
    });

    socket.on('pause', (time) => {
        is_play = false
        current_time = time
        socket.broadcast.emit('pause');
    });

    socket.on('sync_others', () => {
        socket.emit('sync_to_me_other', vid_link, is_play, current_time);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});