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

// Send socket initialization scripts to the client
debugPage.sendDebugWebPage(app);

io.on('connection', (socket) => {
    const player = new Player(socket.id, socket);
    console.log('Connection ' + socket.id);

    handleConnect(player);

    socket.on('currentPlays', ()=> lobbyManager.handleCurrentGames(player));

    socket.on('createRoom', () => lobbyManager.handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => lobbyManager.handleJoinRoom(roomId, player));

    socket.on('checkGameReady', (roomId) => lobbyManager.handleCheckGameReady(roomId, player));

    socket.on('leaveRoom', (roomId) => lobbyManager.handleLeaveRoom(roomId, player));

    socket.on('getCurrentGames', () => lobbyManager.handleGetCurrentGames(player));

    socket.on('joinRoomAsSpectator', (roomId) => lobbyManager.handleJoinRoomAsSpectator(roomId, player))

    socket.on('disconnecting', () => {
        let roomId;
        for (let value of socket.rooms.values()) {
            if (value.length === 6) {
                roomId = value;
            }
        }

        if (roomId !== undefined) lobbyManager.handleLeaveRoom(roomId, player, io);
        else handleDisconnect(player);
    });

    socket.on('setUsername', (username) => players.get(socket.id).setUsername(username));

    socket.on('gameStart', (roomId) => gameManager.handleGameStart(player, roomId));

    socket.on('chatMessage', (message) => chatManager.handleChatMessage(player, message));

    socket.on('playerMove', (newPosition) => gameManager.handlePlayerMove(newPosition, player));

    socket.on('gemCollected', (diamond) => gameManager.handleCollectDiamond(player, diamond));

    socket.on('reachedEnd', (roomID) => gameManager.handleReachingMapEnd(roomID));

    // This message is received every time player clicks on perk (choses perk)
    socket.on('chosenPerk', (chosenPerk) => gameManager.handlePerkChoice(chosenPerk));

    // This message is received when the time for choosing perk is up
    socket.on('finishedPerkChoosing', (lobbyID) => gameManager.handleFinalPerkDecision(lobbyID));

    // This message is received when a player gets hit by the enemy
    socket.on('hitByEnemy', (args) => gameManager.handleHitByEnemy(args.lobbyID, args.damage));
    
    socket.on('getRanking', () => gameManager.handleGetRanking(player));

    socket.on('developerSpawn', (mapInfo) => gameManager.handleDeveloperSpawnOnTheMap(mapInfo, player));
});

function handleConnect(player) {
    players.set(player.id, player);
    console.log(`Established connection with player ${player.id}`);
}

function handleDisconnect(player) {
    players.delete(player.id);
    console.log(`Player ${player.id} has disconnected!`);
}