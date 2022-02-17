const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const Player = require('./model/player.js');

// more info: https://github.com/ai/nanoid
const {nanoid} = require('nanoid');

// key      | value
// playerId | Player
let players = {};

// key      | value
// roomId | Room
let rooms = {};

// Send socket initialization scripts to the client
app.get('/', function (req, res) {
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
    // default length is 21
    const pid = nanoid();
    const player = new Player(pid, socket);

    handleConnect(player);

    socket.on('createRoom', () => {
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
        //send message back to player with lobby id
        socket.emit('roomCreated', roomId);

    });

    socket.on('joinRoom', (roomId) => {
        const room = rooms[roomId];

        if (room) {
            // if player is already in the room
            if (room.players.includes(player)) {
                // TODO: new event to notify player
                return;
            }

            joinRoom(room, player);
            socket.emit('roomJoined', roomId);

            // broadcast to every other team member
            socket.to(room.id).emit('newPlayerJoined', player.id)

        } else {
            socket.emit('roomNotFound', roomId)
        }
    })

    socket.on('disconnect', () => {
        handleDisconnect(player);
    });
});

server.listen(3000, function () {
    console.log('Started application on port %d', 3000);
});

function joinRoom(room, player) {
    room.players.push(player);
    player.socket.join(room.id);

    // Store roomId for future use
    // Might not be needed lol
    player.socket.roomId = room.id;
    console.log(player.id, "Joined", room.id)
}

function handleConnect(player) {
    players[player.id] = player;
    console.log(`Established connection with player ${player.id}`);
}

function handleDisconnect(player) {
    delete players[player.id];
    console.log(`Player ${player.id} has disconnected!`);
}
