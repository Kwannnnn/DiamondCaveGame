const express = require('express');
const app = express();
const socket = require('socket.io');
const dotenv = require('dotenv');

const Player = require('./model/player.js');
const players = require('./model/players.js');
const lManager = require('./lobbyManager.js');
const gManager = require('./gameManager.js');
const cManager =  require('./chatManager.js');
const debugPage = require('./debugWebServer.js');
dotenv.config();

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

let games=[];

// Send socket initialization scripts to the client
debugPage.sendDebugWebPage(app);

io.on('connection', (socket) => {
    // generate new unique id for the player
    let username = socket.request._query['username'];
    if (username === undefined) return;
    // console.log(socket.request._query['username']);
    const player = new Player(username, socket);

    handleConnect(player);

    socket.on('currentPlays',(username)=>{handleCurrentGames(player,games)})

    socket.on('createRoom', () => lobbyManager.handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => lobbyManager.handleJoinRoom(roomId, player));

    socket.on('disconnect', () => handleDisconnect(player));

    socket.on('gameStart', (roomId) => gameManager.handleGameStart(player,roomId));

    socket.on('chatMessage', (message) => chatManager.handleChatMessage(player, message));

    socket.on('playerMove', (newPosition) => gameManager.handlePlayerMove(newPosition, player));

    socket.on('gemCollected', (diamond) => gameManager.handleCollectDiamond(player, diamond));
});

function handleCurrentGames(player,games){
    const plays=games;
    console.log(plays);
    player.socket.emit('currentPlays',plays);
}

function handleConnect(player) {
    players[player.id] = player;
    console.log(`Established connection with player ${player.id}`);
}

function handleDisconnect(player) {
    delete players[player.id];
    console.log(`Player ${player.id} has disconnected!`);
}