const express = require('express');
const app = express();
const socket = require('socket.io');
const dotenv = require('dotenv');

const Player = require('./model/player.js');
const rooms = require('./model/rooms.js');
const players = require('./model/players.js');
const lManager = require('./lobbyManager.js');
const gManager = require('./gameManager.js');
const cManager =  require('./chatManager.js');
const debugPage = require('./debugWebServer.js');
dotenv.config();

// more info: https://github.com/ai/nanoid


const httpServer = app.listen(process.env.PORT, function () {
    console.log(`Started application on port ${process.env.PORT}`);
});

const io = socket(httpServer, {
    cors: {
        origin: '*',
    }
});

const lobbyManager = new lManager(process.env.MAX_ROOM_SIZE);
const gameManager = new gManager(io);
const chatManager = new cManager(io);

// Send socket initialization scripts to the client
debugPage.sendDebugWebPage(app);

io.on('connection', (socket) => {
    // generate new unique id for the player
    let username = socket.request._query['username'];
    if (username === undefined) return;
    // console.log(socket.request._query['username']);
    const player = new Player(username, socket);

    handleConnect(player);

    socket.on('createRoom', () => lobbyManager.handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => lobbyManager.handleJoinRoom(roomId, player));

    socket.on('disconnect', () => handleDisconnect(player));

    socket.on('gameStart', (roomId) => gameManager.handleGameStart(player,roomId));

    socket.on('chatMessage', (message) => chatManager.handleChatMessage(player, message));

    socket.on('playerMove', (newPosition) => gameManager.handlePlayerMove(newPosition, player));

    socket.on('gemCollected', (diamond) => gameManager.handleCollectDiamond(player, diamond));
});

function handleConnect(player) {
    players[player.id] = player;
    console.log(`Established connection with player ${player.id}`);
}

function handleDisconnect(player) {
    delete players[player.id];
    console.log(`Player ${player.id} has disconnected!`);
}

function handleGameOver(roomId) {
    const room = rooms[roomId];

    if (room) {
        const gameState = {
            'score': 6969, // the total score for the team
            'diamonds': 69 // the amount of diamonds collected
        };
    }

    io.to(roomId).emit('gameOver', gameState);
}