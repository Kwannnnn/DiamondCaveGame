import Phaser from 'phaser';
import { CST } from '../utils/CST';

import { determineVelocity, isAtOrPastTarget } from '../helpers/Enemy';
import DiamondCollectEventHandler from '../events/CollectDiamondEvent';
import { Player, Spectator } from '../model';
import HUD from './HUD';

export default class Game extends Phaser.Scene {
    // A physics group representing the diamond sprites
    diamonds;
    // A physics group representing the enemies sprites
    enemies;
    // ???
    layer;
    // A maping of playerIds to player sprites
    players = new Map();
    // The unit the client is able to control
    controlledUnit;
    // The current state of the game
    gameState;

    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');
        this.load.image('enemy', 'assets/dirt.png'); // FIXME: Add an actual enemy sprite
        //this.load.image("exit", "assets/exit.png")
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 154, frameHeight: 276 });

        // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.image('tiles', 'assets/tiles.png');
        // CSV representation of the map
        this.load.tilemapCSV('map', 'assets/tileMap.csv');
    }

    init(data) {
        this.collectedDiamonds = 0;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        this.username = data.username;
        this.gameState = data.initialGameState;
        console.log(this.gameState);
    }

    create() {
        // Create the tilemap with the specified tile dimensions
        let map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        // Map the correct part of the tiles image to the tilemap
        let tileSet = map.addTilesetImage('tiles');
        // Draw the tiles on the screen
        this.layer = map.createLayer(0, tileSet);

        this.setupHUD();
        this.setupPlayers();
        this.setupDiamondLocations();
        this.setupEnemies();
        // this.placeExit(200, 300);
        this.setupControlledUnit();
        this.setupCamera();

        // Adding overalap between player and diamonds (collecting diamonds)
        this.physics.add.overlap(this.controlledUnit, this.diamonds, this.collectDiamond, null, this);

        this.handleSocketEvents();
    }

    update() {
        this.controlledUnit.update();
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
        this.names = new Map();

        // Having the player added to the game
        this.gameState.players.forEach(p => {
            var player = new Player(this, p.x, p.y, p.playerId);
            this.players.set(p.playerId, player);
            var name = this.add.text(p.x - 5, p.y - 10, p.playerId);
            this.names.set(p.playerId, name);
            this.setNamePosition(name, player);
        });
    }

    /**
     * Sets the controlledUnit property to the game object, which can interact
     * with the GameScene.
     */
    setupControlledUnit() {
        if (this.gameState.players.find(p => p.playerId, this.username)) {
            this.controlledUnit = this.players.get(this.username);
            this.name = this.names.get(this.username);
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

    // Restore health to the player
    // This could be any sort of healing, just pass the health change in percentage
    changeHealth(healthChange) {
        HUD.changeHealth(healthChange);
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

        // TODO: Do something meaningful when you collide
    }

    placeExit(x, y) {
        this.exit = this.physics.add.sprite(x, y, "exit");
        this.physics.add.overlap(this.controlledUnit, this.exit, () => {
            this.exitScene();
            this.exit.disableBody(false, false);
        }, this.canExitScene, this);
    }

    canExitScene() {
        if (this.collectedDiamonds == this.totalDiamonds) {
            return true;
        } else {
            console.log("Not all diamonds have been collected!")
            return false;
        }
    }

    exitScene() {
        console.log("Exit! Logic neends to be implemented.")
    }

    /**
     * this is a perk for increasing the movement speed
     */
    increaseSpeed() {
        this.delay = this.delay * 7 / 10;
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
        console.log(args);
        let p = this.players.get(args.playerId);
        let name = this.names.get(args.playerId);
        p.x = args.x;
        p.y = args.y;
        p.orientation = args.orientation;
        this.setNamePosition(name, p);

        switch (p.orientation) {
            case 0:
                p.anims.play('right', true);
                break;
            case 90:
                p.anims.play('up', true);
                break;
            case 180:
                p.anims.play('left', true);
                break;
            default:
                p.anims.play('down', true);
                break;
        }
    }

    handleSocketEvents() {
        this.socket.on('gemCollected', (diamond) => this.handleDiamondCollected(diamond));
        this.socket.on('teammateMoved', (args) => this.handlePlayerMoved(args));
    }
}