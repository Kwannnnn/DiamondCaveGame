// This class manages everything related to in-game events
const map3 = require('./maps/map3.js');
const map2 = require('./maps/map2.js');
const map1 = require('./maps/map1.js');
const rooms = require('./model/rooms.js');
const perks = ['Movement Speed', 'Health', 'Add Diamonds'];
const maps = require('./model/maps.js');

const Run = require('./model/run.js');
const runs = require('./model/runs.js');
const Room = require('./model/room.js');

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
            const initialGameState = this.generateInitialGameState(room, room.maps[room.currentMap]);
            rooms.get(roomId).gameState = initialGameState;

            // TODO: make the client wait for this event to be sent and the map generated (perhaps a loading screen)
            room.gameActive = true;

            const payload = {
                initialGameState: initialGameState,
                health: room.health,
                spectatorsCount: room.spectators.length,
                gemsCollected: room.gemsCollected,
                time: room.time
            }
            this.io.to(roomId).emit('initialGameState', payload);
            room.startTime(this.onUpdateTime.bind(this));
        } else player.socket.emit('roomNotFound', roomId);
    }

    handlePlayerMove(newPosition, player) {
        const roomId = newPosition.roomId;
        const room = rooms.get(roomId);

        if (room) {
            // Update the game state of room
            // room.movePlayer(player.id, newPosition.x, newPosition.y, newPosition.orientation);
            let players = room.gameState.players;

            for (let p of players) {
                if (p.playerId === player.id) {
                    p.x = newPosition.x;
                    p.y = newPosition.y;
                    p.orientation = newPosition.orientation;
                }
            }
            
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

    handleCollectDiamond(player, roomId, gemId) {
        // if (player.x === diamond.x && player.y === diamond.y) {
        //     console.log('Player ' + player.x + ' ' + player.y);
        //     console.log('Diamond ' + diamond.x + ' ' + diamond.y);
        const room = rooms.get(roomId);
        const gems = room.gameState.gems;
        // Update the game state of the room

        if (room) {

            for (let gem of gems) {
                if (gem.gemId === gemId && gemId >= 0) {
                    // TODO: Change the status of the gem, instead of
                    // deleting it completely
                    // gems.splice(index, 1);
                    gem.gemId = -1;
                    room.gemsCollected++;
                    console.log(`[${room.id}] Gems collected: ${room.gemsCollected}`);

                    // Notify both players about collected diamond
                    this.io.to(room.id).emit('gemCollected', gemId);

                    room.spectators.forEach(spectator => {
                        spectator.socket.emit('gemCollected', gemId);
                    });
                    break;
                }
            }
        } else {
            player.socket.emit('roomNotFound', roomId);
        }
        // } else {
        //     player.socket.emit('cheatDetected', player.id);
        // }
    }

    generateInitialGameState(room, map) {
        const player1 = room.players[0];
        const player2 = room.players[1];

        const playerData = map.players;
        playerData[0].playerId = player1.id;
        playerData[0].username = player1.username;
        playerData[1].playerId = player2.id;
        playerData[1].username = player2.username;

        let gameState = {
            level: room.level,
            tileMap: map.tileMap,
            players: playerData,
            gemsCollected: 0,
            exit: map.exit,
            gems: [...map.gems],
            health: room.health,
            enemies: [...map.enemies],
            pressurePlateTraps: [...map.pressurePlateTraps],
            laserTraps: [...map.laserTraps],
        };
        return gameState;
    }

    handleReachingMapEnd(player, roomID) {
        const room = rooms.get(roomID);

        if (room) {

            // Check if two players reached the end, or only one
            if (!room.playersReachedEnd) {
                room.playersReachedEnd = 1;
                player.socket.emit('waitForTeammate');
            } else if (room.playersReachedEnd == 1) {
                room.players.forEach(player => {
                    player.socket.emit('choosePerks', perks);
                });

                room.playersReachedEnd = 0;
            }

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
                if (player.username !== chosenPerk.username) {
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
            room.level += 1;
            room.nextMap();
            // if the choices are the same, apply perk
            if (room.players[0].perkChoice === room.players[1].perkChoice) {
                console.log(room.players[0].perkChoice);
                const perkNameWithoutSpace = room.players[0].perkChoice.replace(/\s/g, '');
                console.log('Perk name without spaces: ' + perkNameWithoutSpace);

                const payload = {
                    initialGameState: this.generateInitialGameState(room, room.maps[room.currentMap]),
                    stage: room.level,
                    health: room.health,
                    spectatorsCount: room.spectators.length,
                    gemsCollected: room.gemsCollected,
                    time: room.time,
                    perk: perkNameWithoutSpace,
                }

                room.players.forEach(player => {
                    player.socket.emit('nextMap', payload);
                }); // player mode

                room.spectators.forEach(spectator => {
                    spectator.socket.emit('nextMap', payload);
                }); // spectator mode
            }
        }
    }

    /**
     * This method handles reducing the health for team
     * @param {roomId} id of the room that has to reduce health 
     * @param {damage} damage that has been caused to the team
     */
    handleHitByEnemy(roomId, damage) {
        const room = rooms.get(roomId);

        if (room) {
            room.health -= damage;

            // Message is sent to all players in room to indicate health loss
            this.io.to(room.id).emit('reduceHealth', damage);

            room.spectators.forEach(spectator => {
                spectator.socket.emit('reduceHealth', damage);
            });

            if (room.health <= 0) {
                this.io.to(room.id).emit('gameOver');
                this.handleGameOver(room);
            }
        }
    }

    // Intersting way of handling developers joining the room (can be even called retarded)
    handleDeveloperSpawnOnTheMap(mapInfo, player) {
        // TODO get the room with developers' room id
        let room = rooms.get('dev'); // ROOM ID of development room
        if (!room) {
            room = new Room('dev');
            rooms.set('dev', room)
        }
        room.players.push(player);

        if (room.players.length > 1) {
            room.players.forEach(developer => {
                let gameState = {
                    'tileMap': maps.get(parseInt(mapInfo.mapId)).tilemap,
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

                    'gemsCollected': 0,

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
                    initialGameState: JSON.stringify(gameState)
                });
            })
        }

    }

    handleGameOver(room) {
        const playerUsernames = room.players.map(p => p.id);
        //TODO: create an algorithm for calculating totalScore
        const totalScore = room.gameState.gemsCollected;
        const time = 6969;

        const run = new Run(room.id, totalScore, time, playerUsernames);
        runs.enqueue(run);

        // remove room from rooms map since we dont need it anymore
        rooms.get(room.id).stopTime();
        rooms.delete(room.id);
        console.log(room.id + ' was deleted!');
        console.log('Does exist: ' + rooms.has(room.id));
        console.log(runs.toArray());
    }

    onUpdateTime(roomId, newTime) {
        const room = rooms.get(roomId);
        if (room) {
            this.io.to(roomId).emit('current-time', newTime);

            room.spectators.forEach(spectator => {
                spectator.socket.emit('current-time', newTime);
            });

            console.log('Room ' + roomId + ': ' + newTime);
        }

    }
}

module.exports = GameManager;