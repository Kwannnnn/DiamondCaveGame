// This class manages the creation of lobbies and connecting to them 
const { customAlphabet } = require('nanoid');
const rooms = require('./model/rooms.js');

class LobbyManager {
    constructor(MAX_ROOM_SIZE){
        this.MAX_ROOM_SIZE = MAX_ROOM_SIZE;
        this.nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    }

    handleCreateRoom(player) {
        //generate unique one time code for the lobby
        const roomId = this.nanoid(6);
    
        // create new room
        let room = {
            id: roomId,
            players: [],
            spectators: []
        };
        // add it to rooms dictionary
        rooms[roomId] = room;
        console.log(rooms);
        this.joinRoom(room, player);
        let playerIDs = [];
        for (player of room.players) {
            playerIDs.push(player.id);
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

    handleJoinRoomAsSpectator(roomId, player) {
        roomId = roomId.toUpperCase();
        const room = rooms[roomId];
    
        if (room) {
            room.spectators.push(player);

            player.socket.to(room.id).emit('newSpectatorJoined', player.id)
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

}

module.exports = LobbyManager;