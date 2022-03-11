// This class manages everything related to in-game events
const rooms = require('./model/rooms.js');


class GameManager{
    constructor(io){
        this.io = io;
    }

    handleGameStart(player, roomId) {
        const room = rooms[roomId];
    
        if (room) {
            const initialGameState = this.generateInitialGameState(room);
            // TODO: make the client wait for this event to be sent and the map generated (perhaps a loading screen)
            this.io.to(roomId).emit('initialGameState', initialGameState);
        } else player.socket.emit('roomNotFound', roomId);
    }

    handlePlayerMove(newPosition, player) {
        const roomId = newPosition.roomId;
        const room = rooms[roomId];
    
        console.log(player.id);
    
        if (room) {
            // Notify all teammates about the movement
            player.socket.to(roomId).emit('teammateMoved', {
                playerId: player.id,
                x: newPosition.x,
                y: newPosition.y,
                orientation: newPosition.orientation
            });
        } else {
            player.socket.emit('roomNotFound', roomId);
        } 
        // console.log(newPosition);
    }

    handleCollectDiamond(player, diamond) {
        const roomId = diamond.roomId;
        const room = rooms[roomId];
    
        if (room) {
            // Notify teammate about collected diamond
            player.socket.to(roomId).emit('gemCollected', diamond.gemId);
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

    generateInitialGameState(room) {
        const player1 = room.players[0];
        const player2 = room.players[1];
    
        let gameState = {
            'tileMap': [
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
            ],
            'players': [{
                'playerId': player1.id, // the id of player 1
                'x': 32 + 16, // player 1 spawn x position
                'y': 32 + 16, // player 1 spawn y position
                'orientation': 0
            }, {
                'playerId': player2.id, // the id of player 2
                'x': 64 + 16, // player 2 spawn x position
                'y': 64 + 16, // player 2 spawn y position
                'orientation': 0
            }],
            'gems': [{
                'gemId': 1,
                'x': 112, // gem spawn x position
                'y': 48 // gem spawn y position
            },
            {
                'gemId': 2,
                'x': 178, // gem spawn x position
                'y': 80 // gem spawn y position
            },
            {
                'gemId': 3,
                'x': 240, // gem spawn x position
                'y': 112 // gem spawn y position
            },
            {
                'gemId': 4,
                'x': 304, // gem spawn x position
                'y': 144 // gem spawn y position
            },
            {
                'gemId': 5,
                'x': 368, // gem spawn x position
                'y': 176 // gem spawn y position
            }]
        };
        return gameState;
    }
}

module.exports = GameManager;