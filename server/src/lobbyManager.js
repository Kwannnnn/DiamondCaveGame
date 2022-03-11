// This class manages the creation of lobbies and connecting to them 
const { customAlphabet } = require('nanoid');
const rooms = require('./model/rooms.js');
const games = require('./model/games.js');

class LobbyManager {
    constructor(MAX_ROOM_SIZE){
        this.MAX_ROOM_SIZE = MAX_ROOM_SIZE;
        this.nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    }

    handleCurrentGames(player){
        const plays=games;
        console.log(plays);
        player.socket.emit('currentPlays',plays);
    }

    handleCreateRoom(player) {
        //generate unique one time code for the lobby
        const roomId = this.nanoid(6);
    
        // create new room
        let room = {
            id: roomId,
            players: []
        };
        let game = {
            id:roomId,
            players: []
        };    
        // add it to rooms dictionary
        rooms[roomId] = room;
        games[games.length]= game;
        console.log(rooms);
        this.joinRoom(room, player);
        let playerIDs = [];
        for (player of room.players) {
            playerIDs.push(player.id);
        }
        for(let i=0;i<games.length;i++){
            if(roomId===games[i].id){
                games[i].players.push(player.id);
            }
        }    
        //send message back to player with room id and list of playerID
        player.socket.emit('roomCreated', { roomId: roomId, playerIDs: playerIDs });
    }

    joinRoom(room, player) {
        room.players.push(player);
        player.socket.join(room.id);
        // Store roomId for future use
        // Might not be needed lol
        player.socket.roomId = room.id;
        console.log(player.id, 'Joined', room.id);
    }

    handleJoinRoom(roomId, player) {
        roomId = roomId.toUpperCase();
        const room = rooms[roomId];
        for(let i=0;i<games.length;i++){
            if(roomId===games[i].id){
                games[i].players.push(player.id);
            }
        }
        console.log(games[0].players);    
        // TODO: maybe the following code could be better written
        if (room) {
            // if player is already in the room
            if (room.players.includes(player)) {
                player.socket.emit('alreadyInRoom');
                return;
            }
    
            // if room already has 2 players
            if (room.players.length == this.MAX_ROOM_SIZE) {
                player.socket.emit('roomFull');
                return;
            }
    
            this.joinRoom(room, player);
            let playerIDs = [];
            for (player of room.players) {
                playerIDs.push(player.id);
            }
            let data = {
                roomId: roomId,
                playerIDs: playerIDs
            };
            // send room data to the player joins the room
            player.socket.emit('roomJoined', data);
    
            // broadcast to every other team member
            player.socket.to(room.id).emit('newPlayerJoined', playerIDs);
    
            // send game-ready-to-start game event if room is full
            if (room.players.length == this.MAX_ROOM_SIZE) {
                player.socket.to(roomId).emit('gameReadyToStart');
            }
    
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

}

module.exports = LobbyManager;