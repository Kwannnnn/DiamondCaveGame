const express = require('express');
const app = express();
const { customAlphabet } = require('nanoid');
const socket = require("socket.io");
const Player = require('./model/player.js');
const PORT = 3000;

// more info: https://github.com/ai/nanoid
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

const httpServer = app.listen(PORT, function() {
    console.log(`Started application on port ${PORT}`);
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
    <button>Create team</button>
    
    <form>
        <input placeholder="enter your room id">
        <button>Join</button>     
    </form>
<script src="/socket.io/socket.io.js"></script>
<script>
    let socket = io();
    
    let button = document.getElementsByTagName('button')[0];
    
    button.addEventListener('click' , () => {
        socket.emit("createRoom");
    });
    
    socket.on('roomCreated', (lobbyId) => {
        const p = document.createElement('p');
        p.innerText = 'new lobby created with id: ' + lobbyId;
        document.body.append(p);
    });
    
    
    let form = document.getElementsByTagName('form')[0];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let input = document.getElementsByTagName('input')[0].value;
        
        socket.emit("joinRoom", input);
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
</script>`);
});

io.on('connection', (socket) => {
    // generate new unique id for the player
    const pid = nanoid();
    const player = new Player(pid, socket);

    handleConnect(player);

    socket.on('createRoom', () => handleCreateRoom(player));

    socket.on('joinRoom', (roomId) => handleJoinRoom(roomId, player));

    socket.on('disconnect', () => handleDisconnect(player));
});

function joinRoom(room, player) {
    room.players.push(player);
    player.socket.join(room.id);

    // Store roomId for future use
    // Might not be needed lol
    player.socket.roomId = room.id;
    console.log(player.id, "Joined", room.id)
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
    //send message back to player with room id
    player.socket.emit('roomCreated', roomId);
}

function handleJoinRoom(roomId, player) {
    const room = rooms[roomId];

    // TODO: maybe the following code could be better written
    if (room) {
        // if player is already in the room
        if (room.players.includes(player)) {
            player.socket.emit('alreadyInRoom')
            return;
        }

        // if room already has 2 players
        if (room.players.length == process.env.MAX_ROOM_SIZE) {
            player.socket.emit('roomFull')
            return;
        }

        joinRoom(room, player);
        player.socket.emit('roomJoined', roomId);

        // broadcast to every other team member
        player.socket.to(room.id).emit('newPlayerJoined', player.id)

        // send game-ready-to-start game event if room is full
        if (room.players.length == process.env.MAX_ROOM_SIZE) {
            player.socket.to(roomId).emit('gameReadyToStart')
        }

    } else {
        socket.emit('roomNotFound', roomId)
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