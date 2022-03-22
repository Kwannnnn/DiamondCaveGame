// This class manages everything related to in-game events
const rooms = require('./model/rooms.js');
const perks = ['Movement Speed', 'Health', 'Add Diamonds'];
const maps = require('./model/maps.js');

const Run = require('./model/run.js');
const runs = require('./model/runs.js');

class GameManager {
    constructor(io) {
        this.io = io;
    }

    handleGameStart(player, roomId) {
        const room = rooms.get(roomId);

        if (room) {
            if (room.players.length !== 2) {
                player.socket.emit('roomNotReady');
                return;
            }
            const initialGameState = this.generateInitialGameState(room);
            rooms.get(roomId).gameState = initialGameState;
            console.log(rooms.get(roomId).gameState);
            // TODO: make the client wait for this event to be sent and the map generated (perhaps a loading screen)
            this.io.to(roomId).emit('initialGameState', initialGameState);
        } else player.socket.emit('roomNotFound', roomId);
    }

    handlePlayerMove(newPosition, player) {
        const roomId = newPosition.roomId;
        const room = rooms.get(roomId);
        
        if (room) {
            // Update the game state of room
            player.x = newPosition.x;
            player.y = newPosition.y;
            player.orientation = newPosition.orientation;

            // TODO: send back the whole gamestate instead
            // Notify all teammates about the movement
            room.spectators.forEach(spectator => {
                spectator.socket.emit('teammateMoved', {
                    playerId: player.id,
                    x: newPosition.x,
                    y: newPosition.y,
                    orientation: newPosition.orientation
                });
            });

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

    handleGetRanking(player) {
        player.socket.emit('rankList', runs.toArray());
    }

    handleCollectDiamond(player, diamond) {
        const roomId = diamond.roomId;
        const room = rooms.get(roomId);
        const gems = rooms.get(roomId).gameState.gems;
        if (room) {
            // Update the game state of the room
            // TODO: Change the status of the gem, instead of
            // deleting it completely
            for (let i = 0; i < gems.length; i++) {
                if (gems[i].gemId == diamond.gemId) {
                    gems.splice(i, 1);
                    room.gemsCollected++;
                }
            }
            // Notify teammate about collected diamond
            player.socket.to(roomId).emit('gemCollected', diamond.gemId);

            room.spectators.forEach(spectator => {
                spectator.socket.emit('gemCollected', diamond.gemId);
            });
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
    }

    generateInitialGameState(room) {
        const player1 = room.players[0];
        const player2 = room.players[1];

        let gameState = {
            'tileMap': maps.get(1).tilemap,
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

            'gemsCollected' : 0,

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
            }],
            'enemies': [{
                'enemyId': 1,
                'start': {
                    'x': 336,
                    'y': 336,
                },
                'path': [{
                    'x': 496,
                    'y': 336,
                },
                {
                    'x': 496,
                    'y': 496,
                },
                {
                    'x': 336,
                    'y': 496,
                },
                {
                    'x': 336,
                    'y': 336,
                }],
            }],
        };
        return gameState;
    }

    handleReachingMapEnd(roomID) {
        const room = rooms.get(roomID);
    
        if (room) {
            room.players.forEach(player => {
                player.socket.emit('choosePerks', perks);
            });
        } else {
            console.log(rooms);
            console.log('Room id for exit has not been found');
        }
    }

    handlePerkChoice(chosenPerk) {
        const room = rooms.get(chosenPerk.lobbyID);

        // TODO add choices to room object

        if (room) {
            room.players.forEach(player => {
                // If the iterable object is not the player who chose the perk, notify teammate
                // If it is the player, assign the chosen perk to the object
                if (player.id !== chosenPerk.username) {
                    console.log(chosenPerk.username + ' chose ' + perks[chosenPerk.perkId]);
                    
                    // TODO Should be added to the protocol
                    player.socket.emit('teammatePerkChoice', { teammatePerk: perks[chosenPerk.perkId] });
                } else if (!player.perkChoice || player.perkChoice !== perks[chosenPerk.perkId]) {
                    
                    // To keep track of the choices players make, new property of the object is created
                    player.perkChoice = perks[chosenPerk.perkId];
                }
            });

            if (room.players[0].perkChoice === room.players[1].perkChoice) {
                console.log(room.players[0].perkChoice);
                console.log('THE SAME PERK HAS BEEN CHOSEN');

                this.handleFinalPerkDecision(chosenPerk.lobbyID);
                room.players[0].perkChoice = null;
                room.players[1].perkChoice = null;
            }
        }

    }

    /**
     * This method sends all player the final perk that is going to be applied
     * @param {id of the lobby} lobbyID
     */
    handleFinalPerkDecision(lobbyID) {
        console.log('FINISHED PERK CHOOSING');
        const room = rooms.get(lobbyID);

        if (room) {
            // if the choices are the same, apply perk
            if (room.players[0].perkChoice === room.players[1].perkChoice) {
                console.log(room.players[0].perkChoice);
                const perkNameWithoutSpace = room.players[0].perkChoice.replace(/\s/g, '');
                console.log('Perk name without spaces: ' + perkNameWithoutSpace);

                room.players.forEach(player => {
                    console.log(player.id);
                    player.socket.emit('perkForNextGame', { perk: perkNameWithoutSpace, gameState: this.generateInitialGameState(room) });
                });
            }
        }
    }

    /**
     * This method handles reducing the health for team
     * @param {roomId} id of the room that has to reduce health 
     * @param {damage} damage that has been caused to the team
     */
    handleReduceHealth(roomId, damage) {
        const room = rooms.get(roomId);

        if (room) {
            room.health -= damage;

            room.players.forEach(player => {
                // TODO add message to the protocol
                // Message is sent to all players in room to indicate health loss
                player.socket.emit('reduceHealth', { damage });
            });
        }
    }

    // Intersting way of handling developers joining the room (can be even called retarded)
    handleDeveloperSpawnOnTheMap(mapInfo) {
        // TODO get the room with developers' room id
        const room = rooms.get(); // ROOM ID of development room
        
        if (room) {
            room.players.push(player);

            if (room.players.length > 1) {
                room.players.forEach(developer => {
                    let gameState = {
                        'tileMap': maps.get(mapInfo.mapId).tilemap,
                        'players': [{
                            'playerId': room.players[0], // the id of player 1
                            'x': 32 + 16, // player 1 spawn x position
                            'y': 32 + 16, // player 1 spawn y position
                            'orientation': 0
                        }, {
                            'playerId': room.players[1], // the id of player 2
                            'x': 64 + 16, // player 2 spawn x position
                            'y': 64 + 16, // player 2 spawn y position
                            'orientation': 0
                        }],
            
                        'gemsCollected' : 0,
            
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
                        }],
                        'enemies': [{
                            'enemyId': 1,
                            'start': {
                                'x': 336,
                                'y': 336,
                            },
                            'path': [{
                                'x': 496,
                                'y': 336,
                            },
                            {
                                'x': 496,
                                'y': 496,
                            },
                            {
                                'x': 336,
                                'y': 496,
                            },
                            {
                                'x': 336,
                                'y': 336,
                            }],
                        }],
                    };

                    // TODO update protocol
                    developer.socket.emit('developerGamestate', {
                        initialGameState: gameState
                    });
                })
            }
            
        }
    }

    handleGameOver(roomId) {
        const room = rooms.get(roomId);
        const playerUsernames = room.players.map(p => p.id);
        //TODO: create an algorithm for calculating totalScore
        const totalScore = room.gameState.gemsCollected;
        const time = 6969;

        const run = new Run(roomId, totalScore, time, playerUsernames);
        runs.enqueue(run);

        // remove room from rooms map since we dont need it anymore
        // rooms.delete(roomId);
        console.log(runs.toArray());
    }
}

module.exports = GameManager;