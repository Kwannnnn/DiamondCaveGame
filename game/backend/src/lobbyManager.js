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


            //validate names
            //if the return value is false, there are duplicates
            if (!this.validateNames(room, player)) {
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

            //validate names
            //if the return value is false, there are duplicates
            if (!this.validateNames(room, player)) {
                return;
            }
            
            room.spectators.push(player);


            // TODO: handle on client
            player.socket.to(room.id).emit('newSpectatorJoined', player.id);
            player.socket.emit('runGameScene', roomId, room.gameState)
            console.log('Spectator ' + player.id + ' joined room ' + roomId);
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }


    /**
     * check names of players and spectators to prevent duplication
     * @param room the room to check
     * @param player the player object that represent a player or a spectator joining
     */
    validateNames(room, player) {

        if (room.players.length != 0 || room.spectators.length != 0) {
            //if there are already players or spectators in the room, check names

            //iterate over players in the room
            //property "id" is the unique name for players
            for (const p of room.players) {
                if (p.id == player.id) {
                    player.socket.emit('nameAlreadyExistForAPlayer');
                    return false;
                }
            }

            //iterate over spectators in the room
            //spectators use player model and are stored in array spectators
            for (const s of room.spectators) {
                if (s.id == player.id) {
                    player.socket.emit('nameAlreadyExistForASpectator');
                    return false;
                }
            }

            //players or spectators exist, but after iterating over them no duplicating names found
            return true;
        }

        //no player nor spectator exist
        return true;
    }

}




module.exports = LobbyManager;