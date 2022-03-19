// This class manages the creation of lobbies and connecting to them 
const { customAlphabet } = require('nanoid');
const Room = require('./model/room.js');
const rooms = require('./model/rooms.js');
class LobbyManager {
    constructor(MAX_ROOM_SIZE) {
        this.MAX_ROOM_SIZE = MAX_ROOM_SIZE;
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
        console.log(player.id, 'Joined', room.id);
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
        const room = rooms.get(roomId);

        if (room) {
            room.spectators.push(player);


            // TODO: handle on client
            player.socket.to(room.id).emit('newSpectatorJoined', player.id);
            player.socket.emit('runGameScene', roomId,room.gameState)
            console.log('Spectator ' + player.id + ' joined room ' + roomId);
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

}

module.exports = LobbyManager;