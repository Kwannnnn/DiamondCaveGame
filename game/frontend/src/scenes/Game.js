import Phaser from 'phaser';
import { CST } from "../CST";

import DiamondCollectEventHandler from '../events/CollectDiamondEvent';
import HUD from './HUD';

let layer;

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        })
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');

        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 154, frameHeight: 276});

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map
    }

    init() {
        this.totalDiamonds = 10;
        this.collectedDiamonds = 0;
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

        if (this.input.keyboard.checkDown(this.keys.A, 200)) {     
            this.player.anims.play('left', true);
            movementX = -32;
        } else if (this.input.keyboard.checkDown(this.keys.D, 200)) {
            this.player.anims.play('right', true);
            movementX = 32;
        } else if (this.input.keyboard.checkDown(this.keys.S, 200)) {
            this.player.anims.play('down', true);
            movementY = 32;
        } else if (this.input.keyboard.checkDown(this.keys.W, 200)) {
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

        // Scope each diamond
        this.diamonds.children.iterate(function (child) {
            child.setScale(0.2);
        });        

        // Adding overalap between player and diamonds (collecting diamonds)
        this.physics.add.overlap(this.player, this.diamonds, this.collectDiamond, null, this); 
    }
}