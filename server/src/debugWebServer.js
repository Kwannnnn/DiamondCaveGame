const sendDebugWebPage = (app)=>{
    app.get('/', function (req, res) {
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

        <form>
            <input placeholder="Enter chat message">
            <button>Send</button>     
        </form>
    <script src="/socket.io/socket.io.js"></script>
    <script>
    
        let createForm = document.getElementsByTagName('form')[0];
    
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementsByTagName('input')[0].value;
            socketLogic(username, null, null);
        });
    
        let joinForm = document.getElementsByTagName('form')[1];
    
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementsByTagName('input')[1].value;
            let roomID = document.getElementsByTagName('input')[2].value;
            socketLogic(username,roomID, null);
        });

        let messageForm = document.getElementsByTagName('form')[2];

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let username = document.getElementsByTagName('input')[1].value;
            let roomID = document.getElementsByTagName('input')[2].value;
            let message = document.getElementsByTagName('input')[3].value;
            socketLogic(username,roomID,message);
        });
    
        function socketLogic(username, room, message){
            let socket = io({query: 'username='+username});
    
            if (room === null) socket.emit("createRoom");
            else socket.emit('joinRoom',room);

            if (message !== null) socket.emit("chatMessage", message);
        
            socket.on('roomCreated', (lobbyId) => {
                const p = document.createElement('p');
                p.innerText = 'new lobby created with id: ' + lobbyId.roomId;
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

            socket.on('chatMessage', (data) => {
                const p = document.createElement('p');
                p.innerText = 'Player ' + data.sender + ' said: ' + data.message;
                document.body.append(p);
            })
        }
    </script>`);
    });
};

exports.sendDebugWebPage = sendDebugWebPage;