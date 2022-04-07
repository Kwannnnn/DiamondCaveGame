import Phaser from 'phaser';
import { CST } from '../utils/CST';

import { determineVelocity, isAtOrPastTarget } from '../helpers/Enemy';
import DiamondCollectEventHandler from '../events/CollectDiamondEvent';
import LeaveMapEvent from '../events/LeaveMapEvent';
import { Player, Spectator } from '../model';
import HUD from './HUD';
import ChatScene from './ChatScene';
import { handlePressureDoors, setTraps } from '../helpers/PressurePad';
import SpikeTrap from '../model/SpikeTrap';
import LaserTrap from '../model/LaserTrap';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');
        // FIXME: Add an actual enemy sprite
        this.load.image('enemy', 'assets/WispyEnemy.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 160, frameHeight: 260 });

        // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.image('tiles', 'assets/tiles.png');
        // CSV representation of the map
        // this.load.tilemapCSV('map', 'assets/tileMap.csv');

        this.load.image('laser', 'assets/laser_trap.PNG');
        this.load.image('beam', 'assets/laser_beam.png');

        this.load.image('spikeOn',  'assets/spikeTrapOn.png');
        this.load.image('spikeOff', 'assets/spikeTrapOff.png');
        // Load sprites for particles (player movement)
        this.load.spritesheet('moveParticles', 'assets/Player moved.png', { frameWidth: 48, frameHeight: 32 });

        this.load.image('spawnParticle', 'assets/visual_effects/—Pngtree—cute white clouds smoke clouds_6492845.png');

        // Sounds effects
        this.load.audio('gameEnter', ['assets/sound_effects/entering_the_game.mp3']);
        this.load.audio('diamondCollect', ['assets/sound_effects/diamond-collected.mp3']);
        this.load.audio('stepTrap', ['assets/sound_effects/step-on-trap.mp3']);
    }

    init(data) {
        this.world = data.world;
        this.stage = data.stage;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        this.username = data.username;
        this.gameState = data.initialGameState;
        this.perk = data.perk;
        this.health = data.health;
        this.spectatorsCount = data.spectatorsCount,
        this.collectedDiamonds = 0;
        this.currentTime = data.time
        this.totalDiamonds = this.gameState.gems.length;

        console.log(this.gameState);
    }

    create() {
        // Create the tilemap with the specified tile dimensions
        let map = this.make.tilemap({ data: this.gameState.tileMap, tileWidth: 32, tileHeight: 32 });
        // Map the correct part of the tiles image to the tilemap
        let tileSet = map.addTilesetImage('tiles');
        // Draw the tiles on the screen
        this.layer = map.createLayer(0, tileSet);

        // this.setupAnimations();
        this.createParticles();

        this.setupAudio();
        this.setupChat();
        this.setupPlayers();
        this.setupPerks();
        this.setupDiamondLocations();
        this.getCollectedDiamondsCurrentMap(this.gameState.gems)
        this.setupEnemies();
        this.setupLaserTraps();
        this.setupSpikeTraps();
        setTraps(this.gameState.pressurePlateTraps, this.spikeTraps);
        this.setupControlledUnit();
        this.setupCamera();
        this.placeExit(this.gameState.exit.x, this.gameState.exit.y);        
        this.setupHUD();

        this.handleSocketEvents();

        this.pressureCheckEvent = this.time.addEvent({
            delay: 100,
            callback: this.checkPressurePlates,
            callbackScope: this,
            loop: true,
        });

        this.gameEnterSound.play();
    }

    getCollectedDiamondsCurrentMap(gems) {
        console.log(gems);
        for (let i = 0; i < gems.length; i++) {
            const gem = gems[i];
            if (gem.gemId === -1) {
                this.collectedDiamonds++;
            }
        }
    }

    checkPressurePlates() {
        handlePressureDoors(this.layer, this.players);
    }

    update() {
        this.controlledUnit.update();

        this.hasSteppedOnSpikeTrap();
        this.hasSteppedInLaserBeam();
    }

    /**
     * Setup audio
     */
    setupAudio() {
        this.collectDiamondSound = this.sound.add('diamondCollect');
        this.gameEnterSound = this.sound.add('gameEnter');
        this.stepTrap = this.sound.add('stepTrap');
    }

    createParticles() {
        this.diamondParticles = this.add.particles('gem');
        this.diamondEmitter = this.diamondParticles.createEmitter({
            speed: 200,
            lifespan: 200,
            blendMode: 'ADD',
            scale: { start: 0.3, end: 0 },
            on: false
        });

        this.spawnParticles = this.add.particles('spawnParticle');
        this.spawnEmitter = this.spawnParticles.createEmitter({
            speed: 400,
            lifespan: 200,
            blendMode: 'ADD',
            scale: { start: 0.2, end: 0 },
            on: false
        })
    }


    /**
     * Adds the HUD to the GameScene
     */
    setupHUD() {
        this.hud = this.scene.add('hud', HUD, true, {
            stage: this.gameState.level,
            totalDiamonds: this.totalDiamonds,
            health: this.health,
            spectatorsCount: this.spectatorsCount,
            gemsCollected: this.collectedDiamonds,
            time: this.currentTime,
            socket: this.socket
        });
    }

    /**
     * Adds the chat room to the GameScene
     */

    setupChat() {
        this.scene.add(CST.SCENES.CHAT, ChatScene, true, {
            socket: this.socket
        });
    }
    /**
     * Creates all player objects and adds them to the players Map property
     * of the GameScene. 
     */
    setupPlayers() {
        this.players = new Map();
        // Having the player added to the game
        this.gameState.players.forEach(p => {
            console.log('PERK TO BE ADDED TO PLAYERS: ' + this.perk)
            const player = new Player(this, p.x, p.y, p.playerId, p.username, this.perk);
            this.players.set(p.playerId, player);
            this.spawnParticles.emitParticleAt(p.x, p.y, 20);
        });
    }

    setupPerks() {
        switch (this.perk) {
            case 'Health':
                this.changeHealth(10);
                break;

            case 'AddDiamonds':
                this.diamondPerk();
                console.log('Collected diamonds after perk: ' + this.collectedDiamonds);
                break;

            default:
                console.log('No team perks!');
        }
    }

    /**
     * Sets the controlledUnit property to the game object, which can interact
     * with the GameScene.
     */
    setupControlledUnit() {
        // Check if the username is in the list of players
        const player = this.gameState.players.find(p => p.playerId === this.socket.id);
        if (player !== undefined) {
            this.controlledUnit = this.players.get(this.socket.id);
            // Adding overalap between player and diamonds (collecting diamonds)
            this.physics.add.overlap(this.controlledUnit, this.diamonds, this.collectDiamond, null, this);
            // Adding overalap between player and enemies (enemy collision)
            // this.physics.add.overlap(this.controlledUnit, this.enemies, this.collideEnemy, null, this);
            this.physics.add.overlap(
                this.controlledUnit,
                this.enemies,
                this.collideEnemy,
                undefined,
                this
            );
            this.controlledUnit.setSocket(this.socket);
        } else {
            // if the game state does not contain the username of the client
            // it means he must be a spectator
            this.controlledUnit = new Spectator(this, 32 + 16, 32 + 16, this.username);
        }
    }

    /**
     * Attach the camera to the controlled unit
     */
    setupCamera() {
        if (this.controlledUnit) {
            this.cameras.main.startFollow(this.controlledUnit);

            const mapWidth = this.gameState.tileMap[0].length * 32;
            const mapHeight = this.gameState.tileMap.length * 32;

            // We need to add the additional 800px so that the camera does not end exactly at the edge of the map
            this.cameras.main.setBounds(-400, -400, mapWidth + 800, mapHeight + 800);
            this.cameras.main.setZoom(2);
        }
    }

    setNamePosition(name, player) {
        name.x = player.x - 20;
        name.y = player.y - 40;
    }

    /**
     * Removes a diamond from the visual map.
     * @param diamondSprite the diamond sprite to remove
     */
    destroyDiamondSprite(diamondSprite) {
        if (diamondSprite) {
            diamondSprite.disableBody(true, true);
        }
    }

    /**
     * Updates the count of collected diamonds and fires an 'update-count'
     * event to the DiamondCollectEventHandler.
     */
    updateCollectedDiamondsCount() {
        this.collectedDiamonds++;
        console.log(this.collectedDiamonds);
        DiamondCollectEventHandler.emit('update-count', this.collectedDiamonds);
    }

    /**
     * Handles diamond collection whenever a player overlaps with a diamond
     * sprite.
     * @param {Player} player the player that collected the diamond
     * @param diamond the collected diamond
     */
    collectDiamond(player, diamond) {
        this.destroyDiamondSprite(diamond);
        this.diamondParticles.emitParticleAt(diamond.x, diamond.y, 50);

        this.socket.emit('collectGem', {
            roomId: this.lobbyID,
            gemId: diamond.id
        });
    }

    /**
     * Handles diamond collection whenever the server sends a 'gemCollected'
     * event on the web socket.
     * @param diamond the diamond that has been collected
     */
    handleDiamondCollected(gemId) {
        // Iterate through diamond physics group to remove matching diamond
        this.diamonds.children.each((child) => {
            if (child.id === gemId) {
                this.destroyDiamondSprite(child);
                this.collectDiamondSound.play()
                this.updateCollectedDiamondsCount();
                this.diamondParticles.emitParticleAt(child.x, child.y, 20);
            }
        });

    }

    /**
     * Creates all diamond objects and places them in a physics group, and
     * renders them on the map.
     */
    setupDiamondLocations() {
        this.diamonds = this.physics.add.group();

        this.gameState.gems.forEach(g => {
            if (g.gemId > -1) {
                let sprite = this.physics.add.sprite(g.x, g.y, 'gem').setScale(0.2);
                sprite.setScale(0.2);
                sprite.id = g.gemId;
                this.diamonds.add(sprite);
            }
        });
    }

    /**
     * Spawn in all initial enemies and start the overall movement event
     */
    setupEnemies() {
        this.enemyData = new Map();
        this.enemies = this.physics.add.group();

        this.gameState.enemies.forEach(e => {
            let sprite = this.physics.add.sprite(e.start.x, e.start.y, 'enemy');
            sprite.id = e.enemyId;
            this.enemies.add(sprite);

            this.enemyData.set(e.enemyId, {
                'path': e.path,
                'target': 0,
            });
        });

        // Start a timer to check the enemy positions
        this.timedEvent = this.time.addEvent({
            delay: 100,
            callback: this.updateEnemyPositions,
            callbackScope: this,
            loop: true
        });
    }

    /**
     * Setup the laser traps
     */
    setupLaserTraps() {
        this.laserTraps = [];

        for (const [id, laserDetails] of this.gameState.laserTraps.entries()) {
            const { x, y, direction, range } = laserDetails;

            const laserTrap = new LaserTrap(id, x, y, direction, range, this.socket);
            laserTrap.generateBeamSprites(this);
            this.laserTraps.push(laserTrap);
        }
    }

    /**
     * Check if the player has stepped into a laserbeam
     */
    hasSteppedInLaserBeam() {
        for (const laserTrap of this.laserTraps) {
            laserTrap.steppedInLaser(this.controlledUnit, this.lobbyID);
        }
    }

    /**
     * Place SpikeTrap objects where 4s appear on the tilemap
     */
    setupSpikeTraps() {
        // get all spike trap coordinates
        this.spikeLocations = this.getCoordinatesFromTileMap(4); // array of coordinate objects
        this.spikeTraps = []; // array of SpikeTrap objects

        // create SpikeTrap and sprite objects at the correct coordinates
        for (const [id, spikeLocation] of this.spikeLocations.entries()) {
            const { x, y } = spikeLocation;
            const trapSprite = this.physics.add.sprite(x, y, 'spikeOn');
            const trap = new SpikeTrap(id, x, y, this.socket, trapSprite);

            // add both to arrays so that they can be found later
            this.spikeTraps.push(trap);
        }
    }

    /**
     * Finds the coordinates for each location that the given number appears
     */
    getCoordinatesFromTileMap(tileNumber) {
        let locations = [];

        // itirate through the gameState tileMap to find coordinates of the provided number
        for (let row = 0; row < this.gameState.tileMap.length; row++) {
            for (let column = 0; column < this.gameState.tileMap[row].length; column++) {
                // value found?
                if (this.gameState.tileMap[row][column] == tileNumber) {
                    // translate index to coordinates
                    let coordinates = {
                        x: column * 32 + 16,
                        y: row * 32 + 16
                    };
                    // register these coordinates
                    locations.push(coordinates);
                }
            }
        }
        return locations;
    }

    /**
     * Check whether player has stepped on a spike trap
     */
    hasSteppedOnSpikeTrap() {
        for (const spikeTrap of this.spikeTraps) {
            const spikePos = {
                x: spikeTrap.x,
                y: spikeTrap.y,
            };

            // Check if player overlaps spikeTrap
            if (this.controlledUnit.x === spikePos.x && this.controlledUnit.y === spikePos.y) {
                spikeTrap.steppedOnSpikeTrap(this.controlledUnit, this.lobbyID);
            }
        }
    }

    /**
     * Update the enemy positions and their velocity
     */
    updateEnemyPositions() {
        this.enemies.children.each(e => {
            if (this.enemyData.get(e.id).path.length > 0) {
                const { id, x, y } = e;
                const { velocity } = e.body;

                const data = this.enemyData.get(id);
                let targetLocation = data.path[data.target];

                if (velocity.x === 0 && velocity.y === 0) {
                    const { velocityX, velocityY } = determineVelocity({ x, y }, targetLocation);
                    e.body.setVelocity(velocityX, velocityY);
                }

                // Check if we are at, or have passed our current target position.
                if (isAtOrPastTarget({ x, y }, targetLocation, velocity)) {
                    e.body.setVelocity(0, 0);
                    // Set the enemy to the actual target position to handle moving too far
                    e.x = targetLocation.x;
                    e.y = targetLocation.y;

                    // Update the new target index, loops at the end of the path array.
                    data.target = (data.target + 1) >= data.path.length ? 0 : data.target + 1;
                    targetLocation = data.path[data.target];
                }

                this.enemyData.set(id, data);
            }
        });
    }

    // Restore health to the player
    // This could be any sort of healing, just pass the health change in percentage
    changeHealth(healthChange) {
        this.hud.changeHealth(healthChange);
    }

    /**
     * damage caused to health when coliding with laser trap
     */
    dealLaserDamage() {
        this.changeHealth(-15);
    }

    /**
     * This is called when moving to perks scene
     * Stops Interval timers for all spike and laser traps
     */
    stopAllTraps() {
        for (const spikeTrap of this.spikeTraps) {
            spikeTrap.disableTrap();
        }
        for (const laserTrap of this.laserTraps) {
            laserTrap.disableTrap();
        }
    }

    /**
     * Handle colliding with an enemy
     */
    collideEnemy(player, enemy) {
        console.log(`Hit enemy: ${enemy.id}`);

        // makes the player transparent for 1.5 seconds
        // TODO: perhaps make him invicible as well
        this.controlledUnit.alpha = 0.5;
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.controlledUnit.alpha = 1;
            },
            loop: false
        })

        // push back the player so he does not overlap with the enemy
        this.controlledUnit.x -= 32;
        this.controlledUnit.y -= 32;

        const damage = 30;

        // Send message to the server
        this.socket.emit('hitByEnemy', {
            lobbyID: this.lobbyID,
            damage: damage
        });

    }

    /**
     * Places exit on the map
     * @param {coordinate x for exit to be place} x 
     * @param {coordinate y for exit to be place} y 
     */
    placeExit(x, y) {
        this.exit = this.physics.add.sprite(x, y, 'exit').setScale(0.5);
        this.physics.add.overlap(this.controlledUnit, this.exit, () => {
            console.log('At exit location');
            if (this.canExitScene()) {
                this.exitScene();
                this.exit.disableBody(false, false);
                console.log('exitexitexit');
            }
        });
    }

    /**
     * Checks if all dimonds were collected to exit the map
     * @returns boolean
     */
    canExitScene() {
        if (this.collectedDiamonds >= this.gameState.gems.length) {
            return true;
        } else {
            console.log('Not all diamonds have been collected!')
            return false;
        }
    }

    /**
     * Sends message to server to transfer players to PerkScene
     */
    exitScene() {
        this.socket.emit('reachedEnd', this.lobbyID);
    }

    /**
     * this is a perk for adding 4 more diamonds into the number of collected diamonds
     */
    diamondPerk() {
        this.collectedDiamonds += 4;
    }

    /**
     * this perk for reducing 10 seconds for the team
     */
    timePerk() {
        if (HUD.second < 10) {
            HUD.minute--;
            HUD.second += 60;
            HUD.second -= 10;
        } else {
            HUD.second -= 10;
        }
    }

    /**
     * Handles player movement logic for a non-controlled player unit.
     * @param {Object} args the arguments sent from the server
     */
    handlePlayerMoved(args) { 
        let p = this.players.get(args.playerId);
        p.move(args.x, args.y, args.orientation);
    }

    handleCheatDetected(cheaterId) {
        console.log('Player with id ' + cheaterId + ' has cheated!');
    }

    /**
     * Should be triggered when player tries to leave the map alone
     */
    handleSingleMapLeaving() {
        LeaveMapEvent.emit('wait-for-player');
        console.log('You cannot leave the map alone');
    }

    handleSocketEvents() {
        this.socket.on('gemCollected', (gemId) => this.handleDiamondCollected(gemId));
        this.socket.on('teammateMoved', (args) => this.handlePlayerMoved(args));
        this.socket.on('choosePerks', (perks) => {
            this.stopAllTraps();
            this.scene.remove(CST.SCENES.HUD);
            this.scene.remove(CST.SCENES.CHAT);
            this.scene.pause();
            this.scene.launch(CST.SCENES.PERKS, {
                perksNames: perks,
                username: this.username,
                socket: this.socket,
                lobbyID: this.lobbyID,
                // Only for testing (server needs to send new gameState to PerkScene to start Game scene)
                gameState: this.gameState
            });

            // When the HUD is destroyed, we need to stop forwarding event messages to it.
            this.socket.off('current-time');
        });
        this.socket.on('playerChoosePerks', () => {
            this.scene.pause();
            this.add.text(this.game.renderer.width / 4 - 100, this.game.renderer.height / 4, 'Waiting for the players to choose their perks...', { fontSize: '32px', fill: '#fff' });
        }) // handle player choosing perks for spectator mode
        this.socket.on('nextMap', (payload) => {
            this.scene.remove(CST.SCENES.HUD);
            this.scene.remove(CST.SCENES.CHAT);
            this.scene.remove(CST.SCENES.PERKS);
            this.socket.removeAllListeners();
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: payload.stage,  
                socket: this.socket,
                username: this.username,
                lobbyID: this.lobbyID,
                initialGameState: payload.initialGameState,
                health: payload.health,
                spectatorsCount: payload.spectatorsCount,
                gemsCollected: payload.gemsCollected,
                time: payload.time
            });
        }) // changing scene for spectator mode
        this.socket.on('reduceHealth', (damage) => {
            // Change the health on hud
            this.changeHealth(-damage);

            console.log('Team got damage ' + damage + ' health points');
        });

        this.socket.on('gameOver', () => {
            this.stopAllTraps();
            this.scene.remove(CST.SCENES.HUD);
            this.scene.remove(CST.SCENES.CHAT);
            this.scene.pause();
            this.scene.start(CST.SCENES.GAMEOVER);
        });
        this.socket.on('cheatDetected', (cheaterId) => this.handleCheatDetected(cheaterId));

        this.socket.on('waitForTeammate', () => this.handleSingleMapLeaving());

        this.socket.on('current-time', (time) => this.hud.setTime(time));

    }
}