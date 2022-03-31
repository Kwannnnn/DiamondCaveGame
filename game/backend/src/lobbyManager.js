// This class manages the creation of lobbies and connecting to them 
const { customAlphabet } = require('nanoid');
const Room = require('./model/room.js');
const rooms = require('./model/rooms.js');
class LobbyManager {
    constructor() {
        this.MAX_ROOM_SIZE = 2;
        this.nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    }

    handleGetCurrentGames(player) {
        //get all active games
        const games = []
        for (let room of rooms.values()) {
            const roomObject = {
                roomId: room.id,
                playerIds: []
            }

            // get ids of players in the room
            for (let player of room.players) {
                roomObject.playerIds.push(player.id)
            }

            games.push(roomObject);
        }
        player.socket.emit('currentGames', games);
    }

    handleCreateRoom(player) {
        //generate unique one time code for the lobby
        const roomId = this.nanoid(6);

        // create new room
        let room = new Room(roomId);

        // add it to rooms map
        rooms.set(roomId, room);

        //add player to the room
        this.joinRoom(room, player, false);
        let playerIDs = [];
        for (player of room.players) {
            playerIDs.push(player.id);
        }

        //send message back to player with room id and list of playerIDs
        player.socket.emit('roomCreated', { roomId: roomId, playerIDs: playerIDs });
    }

    joinRoom(room, player, isSpectator) {
        if (!isSpectator) room.players.push(player);
        else room.spectators.push(player);
        player.socket.join(room.id);
        // Store roomId for future use
        // Might not be needed lol
        player.roomId = room.id;
    }

    handleJoinRoom(roomId, player) {
        roomId = roomId.toUpperCase();
        const room = rooms.get(roomId);

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

            this.joinRoom(room, player, false);
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
            player.socket.to(room.id).emit('newPlayerJoined', player.id);

        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

    handleCheckGameReady(roomId, player) {
        const room = rooms.get(roomId);

        if (room) {
            // send game-ready-to-start game event if room is full
            console.log(room.players.length);
            if (room.players.length === this.MAX_ROOM_SIZE) {
                player.socket.to(room.id).emit('gameReadyToStart');
            } // else send game-not-ready-to-start event
            if (room.players.length !== this.MAX_ROOM_SIZE) {
                player.socket.emit('gameNotReadyToStart');
            }
        }
    }

    handleLeaveRoom(roomId, player) {
        console.log('roomId: ' + roomId);
        const room = rooms.get(roomId);
        if (room) {
            // remove player from room
            room.players = room.players.filter(p => p.id != player.id);
            room.spectators = room.spectators.filter(p => p.id != player.id);
        } 
        let playerNames = [];
        for (let p of room.players) {
            playerNames.push(p.id);
        }
        // broadcast to other team member
        room.players.forEach(p => p.socket.emit('playerLeft', playerNames));
        player.socket.leave(room.id);
    }
    
    handlePlayerDisconnected(playerId) {
        console.log('a player disconnected from the room')
        for (let room of rooms.values()) {
            if (room.players.includes(playerId)) {
                room.players = room.players.filter(p => p.id != playerId);
                room.spectators = room.spectators.filter(p => p.id != playerId);
                let playerNames = [];
                for (let p of room.players) {
                    playerNames.push(p.id);
                }
                // broadcast to other team member
                room.players.forEach(p => p.socket.emit('playerLeft', playerNames));
            }
        }
    }

    handleJoinRoomAsSpectator(roomId, player) {
        roomId = roomId.toUpperCase();
        const room = rooms.get(roomId);

        if (room) {
            room.spectators.push(player);
            // TODO: handle on client
            player.socket.to(room.id).emit('newSpectatorJoined', player.id);
            player.socket.emit('runGameScene', roomId, room.gameState)
            console.log('Spectator ' + player.id + ' joined room ' + roomId);
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

}

module.exports = LobbyManager;