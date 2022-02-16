const PORT = 3000;

const express = require('express');
const app = express();
const httpServer = app.listen(PORT, function () {
    console.log(`Started application on port ${PORT}`);
});
const io = require('socket.io')(httpServer);

let connections = [];

io.on('connection', function (socket) {
    handleConnect(socket);

    socket.on('disconnect', () => handleDisconnect(socket));
});

function handleConnect(socket) {
    connections.push(socket.id);
    console.log(`Established connection with client ${socket.id}`);
}

function handleDisconnect(socket) {
    connections = connections.filter(client => client !== socket.id);
    console.log(`Client ${socket.id} has disconnected!`);
}