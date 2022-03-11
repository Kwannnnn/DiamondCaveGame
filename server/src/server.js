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
    // generate new unique id for the player
    let username = socket.request._query['username'];
    if (username === undefined) return;
    // console.log(socket.request._query['username']);
    const player = new Player(username, socket);

    handleConnect(player);

    socket.on('currentPlays',()=> lobbyManager.handleCurrentGames(player));

    socket.on('createRoom', () => lobbyManager.handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => lobbyManager.handleJoinRoom(roomId, player));

    socket.on('joinRoomAsSpectator', (roomId) => lobbyManager.handleJoinRoomAsSpectator(roomId, player))

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

// this is hardcoded for now
function generateInitialGameState(room) {
    const player1 = room.players[0];
    const player2 = room.players[1];

    let gameState = {
        'tileMap': [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        ],
        'players': [{
            'playerId': player1.id, // the id of player 1
            'x': 32 + 16, // player 1 spawn x position
            'y': 32 + 16, // player 1 spawn y position
            'orientation': 0
        }, {
            'playerId': player2.id, // the id of player 2
            'x': 64 + 16, // player 2 spawn x position
            'y': 64 + 16, // player 2 spawn y position
            'orientation': 0
        }],
        'gems': [{
            'gemId': 1,
            'x': 112, // gem spawn x position
            'y': 48 // gem spawn y position
        },
        {
            'gemId': 2,
            'x': 178, // gem spawn x position
            'y': 80 // gem spawn y position
        },
        {
            'gemId': 3,
            'x': 240, // gem spawn x position
            'y': 112 // gem spawn y position
        },
        {
            'gemId': 4,
            'x': 304, // gem spawn x position
            'y': 144 // gem spawn y position
        },
        {
            'gemId': 5,
            'x': 368, // gem spawn x position
            'y': 176 // gem spawn y position
        }],
        'enemies': [{
            'enemyId': 1,
            'start': {
                'x': 336,
                'y': 336,
            },
            'path': [{
                'x': 496,
                'y': 336,
            },
            {
                'x': 496,
                'y': 496,
            },
            {
                'x': 336,
                'y': 496,
            },
            {
                'x': 336,
                'y': 336,
            }],
        }],
    };
    return gameState;
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

function handleCollectDiamond(player, diamond) {
    const roomId = diamond.roomId;
    const room = rooms[roomId];

    if (room) {
        // Notify teammate about collected diamond
        player.socket.to(roomId).emit('gemCollected', diamond.gemId);
    } else {
        socket.emit('roomNotFound', roomId);
    }
    console.log(diamond);
}