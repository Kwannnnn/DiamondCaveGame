import Phaser from 'phaser';
import { CST } from '../CST';

import DiamondCollectEventHandler from '../events/CollectDiamondEvent';
import HUD from './HUD';

let layer;
let delay;

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        });
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');

        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 154, frameHeight: 276});

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map
    }

    init(data) {
        this.totalDiamonds = 10;
        this.collectedDiamonds = 0;

        //the ideal delay for the normal speed to begin with is 200
        this.delay=200;

        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        this.socket.on('gemCollected', (diamond) => this.handleDiamondCollected(diamond));

    }

    create() {
        let map = this.make.tilemap({key: 'map', tileWidth: 32, tileHeight: 32}); // Create the tilemap with the specified tile dimensions
        let tileSet = map.addTilesetImage('tiles'); // Map the correct part of the tiles image to the tilemap

        layer = map.createLayer(0, tileSet); // Draw the tiles on the screen

        // Add the HUD scene
        this.scene.add('hud', HUD, true, {world: 1, stage: 1, totalDiamonds: this.totalDiamonds});

        // Having the player added to the game
        this.player = this.physics.add.sprite(32+16, 32+16, 'player').setScale(0.14);
        this.setupPlayerMovement();

        // Send the new player position to the server on key release
        // This happens on ANY key release that is part of the scene input
        this.input.keyboard.on('keyup', this.handlePlayerMoved.bind(this));
        
        // Stick camera to the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(-400, -400, 1880, 1320);

        this.setupDiamondLocations(this.totalDiamonds);
    }

    update() {
        this.handlePlayerMovement();
    }

    handlePlayerMovement() {
        let movementX = 0;
        let movementY = 0;

        if (this.input.keyboard.checkDown(this.keys.A, this.delay)) {     
            this.player.anims.play('left', true);
            movementX = -32;
        } else if (this.input.keyboard.checkDown(this.keys.D, this.delay)) {
            this.player.anims.play('right', true);
            movementX = 32;
        } else if (this.input.keyboard.checkDown(this.keys.S, this.delay)) {
            this.player.anims.play('down', true);
            movementY = 32;
        } else if (this.input.keyboard.checkDown(this.keys.W, this.delay)) {
            this.player.anims.play('up', true);
            movementY = -32;
        }

        // Check tile we are attempting to move to
        let tile = layer.getTileAtWorldXY(this.player.x + movementX, this.player.y + movementY, true);

        if (tile && tile.index !== 2) {
            this.player.x = this.player.x + movementX;
            this.player.y = this.player.y + movementY;
        }
    }

    collectDiamond(player, diamond) {
        diamond.disableBody(true, true);
        this.collectedDiamonds++;
        
        DiamondCollectEventHandler.emit('update-count', this.collectedDiamonds);



        //this is a small test for the speed increase 
        /* this.increaseSpeed();
        console.log('current delay:'+this.delay); */

        this.socket.emit('gemCollected', {
            roomId: this.lobbyID,
            gemId: diamond.id
        });

    }

    setupPlayerMovement() {
        // Register player movement keys
        this.keys = this.input.keyboard.addKeys('W,S,A,D', true, true);

        const animationKeys = ['up', 'down', 'right', 'left'];
        for (const index in animationKeys) {
            this.anims.create({
                key: animationKeys[index],
                frames: [ { key: 'player', frame: index } ],
                frameRate: 20
            });
        }
    }

    setupDiamondLocations(numberOfDiamonds) {
        this.diamonds = this.physics.add.group({
            key: 'gem',
            repeat: numberOfDiamonds - 1,
            setXY: {x: 112, y: 48, stepX: 64, stepY: 32}
        });

        let id = 1;
        // Scope each diamond
        this.diamonds.children.iterate(function (child) {
            child.setScale(0.2);
            child.id = id;
            id++;
        });        

        // Adding overalap between player and diamonds (collecting diamonds)
        this.physics.add.overlap(this.player, this.diamonds, this.collectDiamond, null, this); 
    }



    increaseSpeed(){
        this.delay=this.delay*7/10;
    }
    /**
     * Fires an event on the socket for player movement, sending the new player
     * position.
     */
    handlePlayerMoved() {
        this.socket.emit('playerMove', {
            roomId: this.lobbyID,
            x: this.player.x,
            y: this.player.y,
            orientation: this.player.orientation
        });
    }

    handleDiamondCollected(diamond){
        this.diamonds.children.each((child) => this.removeDiamond(child, diamond)); //Iterate through diamond list to remove matching diamond
    }

    removeDiamond(testDiamond, targetID){
        if (testDiamond.id === targetID){
            testDiamond.disableBody(true, true);
            this.collectedDiamonds++;
            DiamondCollectEventHandler.emit('update-count', this.collectedDiamonds);
        }

    }
}