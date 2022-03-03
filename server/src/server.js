const express = require('express');
const app = express();
const { customAlphabet } = require('nanoid');
const socket = require('socket.io');
const Player = require('./model/player.js');
const dotenv = require('dotenv');
dotenv.config();

// more info: https://github.com/ai/nanoid
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const httpServer = app.listen(process.env.PORT, function() {
    console.log(`Started application on port ${process.env.PORT}`);
});

const io = socket(httpServer, {
    cors: {
        origin: '*',
    }
});

// key      | value
// playerId | Player
let players = {};

// key      | value
// roomId | Room
let rooms = {};

// Send socket initialization scripts to the client
app.get('/', function(req, res) {
    res.send(`
    <form>
        <input placeholder="Enter your username">
        <button>Create team</button>     
    </form>
    
    <form>
        <input placeholder="Enter your username">
        <input placeholder="Enter your room id">
        <button>Join</button>     
    </form>
<script src="/socket.io/socket.io.js"></script>
<script>

    let createForm = document.getElementsByTagName('form')[0];

    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementsByTagName('input')[0].value;
        socketLogic(username, null);
    });

    let joinForm = document.getElementsByTagName('form')[1];

    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementsByTagName('input')[1].value;
        let roomID = document.getElementsByTagName('input')[2].value;
        socketLogic(username,roomID);
    });
    

    function socketLogic(username, room){
        let socket = io({query: 'username='+username});

        if (room === null) socket.emit("createRoom");
        else socket.emit('joinRoom',room);
    
        socket.on('roomCreated', (lobbyId) => {
            const p = document.createElement('p');
            p.innerText = 'new lobby created with id: ' + lobbyId;
            document.body.append(p);
        });
        
        socket.on('roomJoined', (roomId) => {
            const p = document.createElement('p');
            p.innerText = 'joined room with id: ' + roomId;
            document.body.append(p);
        })

        socket.on('roomNotFound', (roomId) => {
            const p = document.createElement('p');
            p.innerText = 'Room ' + roomId + ' does not exist';
            document.body.append(p);
        })

        socket.on('newPlayerJoined', (playerId) => {
            const p = document.createElement('p');
            p.innerText = 'Player ' + playerId + ' joined the room';
            document.body.append(p);
        })
    }
</script>`);
});

io.on('connection', (socket) => {
    // generate new unique id for the player
    let username = socket.request._query['username'];
    if (username === undefined) return;
    console.log(socket.request._query['username']);
    const player = new Player(username, socket);

    handleConnect(player);

    socket.on('createRoom', () => handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => handleJoinRoom(roomId, player));

    socket.on('disconnect', () => handleDisconnect(player));

    socket.on('gameStart', (roomId) => handleGameStart(roomId));
});

function joinRoom(room, player) {
    room.players.push(player);
    player.socket.join(room.id);
    // Store roomId for future use
    // Might not be needed lol
    player.socket.roomId = room.id;
    console.log(player.id, 'Joined', room.id);
}

function handleCreateRoom(player) {
    //generate unique one time code for the lobby
    const roomId = nanoid(6);

    // create new room
    let room = {
        id: roomId,
        players: []
    };
    // add it to rooms dictionary
    rooms[roomId] = room;

    joinRoom(room, player);
    console.log("Room info", rooms[roomId]);
    //send message back to player with room id
    player.socket.emit('roomCreated', roomId, player.id);
}

function handleJoinRoom(roomId, player) {
    roomId = roomId.toUpperCase();
    const room = rooms[roomId];

    // TODO: maybe the following code could be better written
    if (room) {
        // if player is already in the room
        if (room.players.includes(player)) {
            player.socket.emit('alreadyInRoom');
            return;
        }

        // if room already has 2 players
        if (room.players.length == process.env.MAX_ROOM_SIZE) {
            player.socket.emit('roomFull');
            return;
        }

        joinRoom(room, player);
        console.log(rooms[roomId]);
        player.socket.emit('roomJoined', roomId, player.id);

        // broadcast to every other team member
        player.socket.to(room.id).emit('newPlayerJoined', player.id);

        // send game-ready-to-start game event if room is full
        if (room.players.length == process.env.MAX_ROOM_SIZE) {
            player.socket.to(roomId).emit('gameReadyToStart');
        }

    } else {
        player.socket.emit('roomNotFound', roomId);
    }
}

function handleGameStart(roomId) {
    const room = rooms[roomId];

    if (room) {
        const initialGameState = generateInitialGameState(room);
        // TODO: make the client wait for this event to be sent and the map generated (perhaps a loading screen)
        io.to(roomId).emit('initialGameState', initialGameState);
    } else {
        socket.emit('roomNotFound', roomId);
    }
}

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
            [2, 2, 2, 2],
            [2, 1, 1, 2],
            [2, 1, 1, 2],
            [2, 2, 2, 2]
        ],
        'players': [{
            'playerId': player1.id, // the id of player 1
            'x': 32 + 16, // player 1 spawn x position
            'y': 32 + 16, // player 1 spawn y position
        }, {
            'playerId': player2.id, // the id of player 2
            'x': 64 + 16, // player 2 spawn x position
            'y': 64 + 16, // player 2 spawn y position
        }],
        'gems': [{
            'x': 64, // gem spawn x position
            'y': 64 // gem spawn y position
        }]
    };

    return gameState;
}