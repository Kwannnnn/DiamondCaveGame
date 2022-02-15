const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

// Send socket initialization scripts to the client
app.get('/', function (req, res) {
    res.send(`
    <button>Create team</button>

<script src="/socket.io/socket.io.js"></script>
<script>
    let socket = io();
    
    let button = document.getElementsByTagName('button')[0];
    
    button.addEventListener('click' , () => {
        socket.emit("create team");
    }, false);
    
    socket.on('new team created', () => {
        const p = document.createElement('p');
        p.innerText = 'New team created';
        document.body.append(p);
    });
    
    socket.on('lobby message event', () => {
        const p = document.createElement('p');
        p.innerText = 'lobby message';
        document.body.append(p);
    });
</script>`);
});

io.on('connection', (socket) => {
    console.log('a new user connected');

    socket.on('create team', () => {
        socket.emit('new team created');

        //generate unique one time code

        //create new lobby
        //send message back to players with code (no code yet)
        socket.join('team lobby');
        io.to("team lobby").emit('lobby message event');

    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(3000, function () {
    console.log("Started application on port %d", 3000);
});