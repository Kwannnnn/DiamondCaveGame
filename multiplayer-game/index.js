const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const Player = require('./model/player.js');

// more info: https://github.com/ai/nanoid
const { nanoid } = require('nanoid');

let playersDict = {};

let connections = [];
// Send socket initialization scripts to the client
app.get('/', function (req, res) {
    res.send(`
    <button>Create team</button>

io.on('connection', function (socket) {
    handleConnect(socket);

    socket.on('disconnect', () => handleDisconnect(socket));
<script src="/socket.io/socket.io.js"></script>
<script>
    let socket = io();
    
    let button = document.getElementsByTagName('button')[0];
    
    button.addEventListener('click' , () => {
        socket.emit("create team");
    });
    
    socket.on('new lobby event', (lobbyId) => {
        const p = document.createElement('p');
        p.innerText = 'new lobby created with id: ' + lobbyId;
        document.body.append(p);
    });
</script>`);
});

io.on('connection', (socket) => {
    console.log('a new user connected');
    // generate new unique id for the player
    // default length is 21
    const pid = nanoid();
    const player = new Player(pid, socket);

    //add new player to players dictionary
    playersDict[pid] = player;

    socket.on('create team', () => {
        //generate unique one time code for the lobby
        const lobbyId = nanoid(6);

        //create new lobby

        //send message back to player with lobby id
        socket.join('team lobby');
        socket.emit('new lobby event', lobbyId);

    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, function () {
    console.log('Started application on port %d', 3000);
});

function handleConnect(socket) {
    connections.push(socket.id);
    console.log(`Established connection with client ${socket.id}`);
}

function handleDisconnect(socket) {
    connections = connections.filter(client => client !== socket.id);
    console.log(`Client ${socket.id} has disconnected!`);
}
