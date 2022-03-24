import Phaser from 'phaser';
import { CST } from '../utils/CST';

import { determineVelocity, isAtOrPastTarget } from '../helpers/Enemy';
import DiamondCollectEventHandler from '../events/CollectDiamondEvent';
import { Player, Spectator } from '../model';
import HUD from './HUD';

export default class Game extends Phaser.Scene {



    // A physics group representing laser traps
    laserTraps;


    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');
        // FIXME: Add an actual enemy sprite
        this.load.image('enemy', 'assets/dirt.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 154, frameHeight: 276 });

        // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.image('tiles', 'assets/tiles.png');
        // CSV representation of the map
        // this.load.tilemapCSV('map', 'assets/tileMap.csv');

        this.load.image('laser','assets/laser_trap.PNG');

    }

    init(data) {
        this.collectedDiamonds = 0;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        this.username = data.username;
        this.gameState = data.initialGameState;
        this.perk = data.perk;

        console.log(this.gameState);
        console.log(data.socket);
    }

    create() {
        // Create the tilemap with the specified tile dimensions
        let map = this.make.tilemap({ data: this.gameState.tileMap, tileWidth: 32, tileHeight: 32 });
        // Map the correct part of the tiles image to the tilemap
        let tileSet = map.addTilesetImage('tiles');
        // Draw the tiles on the screen
        this.layer = map.createLayer(0, tileSet);

        this.setupHUD();
        this.setupPlayers();
        this.setupPerks();
        this.setupDiamondLocations();
        this.setupEnemies();
        // this.placeExit(200, 300);
        this.setupControlledUnit();
        this.setupCamera();
        this.placeExit();

        this.handleSocketEvents();

    }

    update() {
        if (this.scene.isActive(CST.SCENES.CHAT)) {
            this.input.keyboard.enabled = false;
           
        } else {
            this.input.keyboard.enabled = true;
            this.controlledUnit.update();
        }
    
    }

    /**
     * Adds the HUD to the GameScene
     */
    setupHUD() {
        this.scene.add('hud', HUD, true, {
            world: 1,
            stage: 1,
            totalDiamonds: this.gameState.gems.length,
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
            const player = new Player(this, p.x, p.y, p.playerId, this.perk);
            this.players.set(p.playerId, player);
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
        if (this.gameState.players.find(p => p.playerId === this.username)) {
            this.controlledUnit = this.players.get(this.username);
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
            this.cameras.main.setBounds(-400, -400, 1880, 1320);
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
        this.updateCollectedDiamondsCount();

        //this is a small test for the speed increase 
        /* this.increaseSpeed();
        console.log('current delay:'+this.delay); */

        this.socket.emit('gemCollected', {
            roomId: this.lobbyID,
            gemId: diamond.id
        });
    }

    /**
     * Handles diamond collection whenever the server sends a 'gemCollected'
     * event on the web socket.
     * @param diamond the diamond that has been collected
     */
    handleDiamondCollected(diamond) {
        // Iterate through diamond physics group to remove matching diamond
        this.diamonds.children.each((child) => {
            if (child.id === diamond) {
                this.destroyDiamondSprite(child);
                this.updateCollectedDiamondsCount();
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
            let sprite = this.physics.add.sprite(g.x, g.y, 'gem').setScale(0.2);
            this.diamonds.add(sprite);
        });

        let id = 1;
        // Scope each diamond
        this.diamonds.children.iterate(function (child) {
            child.setScale(0.2);
            child.id = id;
            id++;
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


    /**
     * Setup laser traps
     */
    setupLaserTraps() {
        this.laserTrapData = new Map();
        this.laserTrapGroup = this.physics.add.group();

        this.gameState.laserTraps.forEach(st => {
            const sprite = this.physics.add.sprite(st.start.x, st.start.y, 'laser');
            sprite.id = st.trapId;
            sprite.active = st.active;
            this.laserTrapGroup.add(sprite);
        });

        // flickering sprite at a frequancy of every 2 seconds
        this.timedEvent = this.time.addEvent({
            delay: 2000,
            callback: this.updateSpikes,
            callbackScope: this,
            loop: true
        });
    }


    /**
     * update laser trap state on collision
     */
    updateLaserTraps() {
        this.laserTrapGroup.children.each(st => {
            if (st.active === 0) {
                st.active = 1;
                this.physics.add.collider(this.controlledUnit, st, this.dealLaserDamage, this).name = "laserTrapCollisions";
            } else {
                st.active = 0;
            }
        });
    }





    // Restore health to the player
    // This could be any sort of healing, just pass the health change in percentage
    changeHealth(healthChange) {
        HUD.changeHealth(healthChange);
    }

    /**
     * damage caused to health when coliding with laser trap
     */
   dealLaserDamage() {
        this.changeHealth(-15);
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

        const damage = 10;
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
    placeExit() {
        console.log(this.initialGameState);
        this.exit = this.physics.add.sprite(688, 48, 'exit').setScale(0.5);
        this.physics.add.overlap(this.controlledUnit, this.exit, () => {
            console.log('collided');
            if (this.canExitScene()) {
                this.exitScene();
                this.exit.disableBody(false, false);
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

    handleSocketEvents() {
        this.socket.on('gemCollected', (diamond) => this.handleDiamondCollected(diamond));
        this.socket.on('teammateMoved', (args) => this.handlePlayerMoved(args));
        this.socket.on('choosePerks', (perks) => {
            this.scene.remove('hud');
            this.scene.pause();
            this.scene.launch(CST.SCENES.PERKS, {
                perksNames: perks,
                username: this.username,
                socket: this.socket,
                lobbyID: this.lobbyID,
                // Only for testing (server needs to send new gameState to PerkScene to start Game scene)
                gameState: this.gameState
            });
            this.socket.removeAllListeners();
        });
        this.socket.on('reduceHealth', (damage) => {
            // Change the health on hud
            // HUD.changeHealth(damage);

            console.log('Team got damage ' + damage.damage + ' health points');
        })
    }
}