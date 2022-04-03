// This class manages the creation of lobbies and connecting to them 
const { customAlphabet } = require('nanoid');
const Room = require('./model/room.js');
const rooms = require('./model/rooms.js');
class LobbyManager {
    constructor(MAX_ROOM_SIZE, io) {
        this.io = io;
        this.MAX_ROOM_SIZE = 2;
        this.nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    }

    handleGetCurrentGames(player) {
        //get all active games
        const games = []
        for (let room of rooms.values()) {
            const roomObject = {
                roomId: room.id,
                playerIds: [],
                gameActive: room.gameActive
            }

            // get ids of players in the room
            for (let player of room.players) {
                roomObject.playerIds.push(player.username);
            }

            games.push(roomObject);
        }
        player.socket.emit('currentGames', games);
    }

    handleCreateRoom(player) {
        //generate unique one time code for the lobby
        const roomId = this.nanoid(6);

        // create new room
        let room = new Room(roomId, this.io);

        // add it to rooms map
        rooms.set(roomId, room);

        //add player to the room
        this.joinRoom(room, player, false);

        player.socket.emit('roomCreated', {
            roomId: roomId,
            players: [{
                id: player.id,
                username: player.username
            }]
        }); // send message back to player with room id and list of playerIDs
    }

    joinRoom(room, player, isSpectator) {
        if (!isSpectator) room.players.push(player);
        else room.spectators.push(player);
        player.socket.join(room.id);
        // Store roomId for future use
        // Might not be needed lol
        player.roomId = room.id;
        console.log(player.username, 'Joined', room.id);
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
            let players = [];
            for (player of room.players) {
                const id = player.id;
                const username = player.username;
                players.push({
                    id: player.id,
                    username: player.username
                });
            }

            let data = {
                roomId: roomId,
                players: players
            };
            // send room data to the player joins the room
            player.socket.emit('roomJoined', data);

            // broadcast to every other team member
            player.socket.to(room.id).emit('newPlayerJoined', {
                id: player.id,
                username: player.username
            });

            // send game-ready-to-start game event if room is full
            if (room.players.length == this.MAX_ROOM_SIZE) {
                player.socket.to(roomId).emit('gameReadyToStart');
            }

        } else {
            player.socket.emit('roomNotFound', roomId);
            console.log(`[server >> ${player.id}] -- roomNotFound`);
        }
    }

    handleLeaveRoom(roomId, player) {
        const room = rooms.get(roomId);
        if (room === undefined) {
            player.socket.emit('roomNotFound', roomId);
            return;
        }

        // remove player from room
        room.players = room.players.filter(p => p.id != player.id);
        room.spectators = room.spectators.filter(p => p.id != player.id);

        // broadcast to other team member
        if (room.players.length > 0) {
            room.players.forEach(p => p.socket.emit('playerLeft', {
                id: player.id,
                username: player.username
            }));
            player.socket.leave(room.id);
            player.username = undefined;
        } else {
            rooms.delete(roomId);
            console.log('All players left. Room ' + roomId + ' has been deleted.')
        }
    }
    
    handlePlayerDisconnected(playerId) {
        console.log('a player disconnected from the room')
        for (let room of rooms.values()) {
            if (room.players.includes(playerId)) {
                room.players = room.players.filter(p => p.id != playerId);
                room.spectators = room.spectators.filter(p => p.id != playerId);
                let playerNames = [];
                for (let p of room.players) {
                    playerNames.push(p.username);
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

            //validate names
            //if the return value is false, there are duplicates
            if (!this.validateNames(room, player)) {
                return;
            }
            
            room.spectators.push(player);
            // TODO: handle on client
            player.socket.to(room.id).emit('newSpectatorJoined', player.username);

            const payload = {
                initialGameState: room.gameState,
                health: room.health,
                spectatorsCount: room.spectators.length,
                gemsCollected: room.gemsCollected,
                time: room.time
            }
            player.socket.emit('runGameScene', roomId, payload)
            console.log('Spectator ' + player.id + ' joined room ' + roomId);
            player.roomId = room.id;
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
                if (p.id == player.username) {
                    player.socket.emit('nameAlreadyExistForAPlayer');
                    return false;
                }
            }

            //iterate over spectators in the room
            //spectators use player model and are stored in array spectators
            for (const s of room.spectators) {
                if (s.id == player.username) {
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