import Phaser from 'phaser';
import { CST } from "../CST";

let keys;
let layer;

let diamonds;
let diamondCounter;
let totalDiamondsInMap;

let timedEvent;
let clock;

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


    init()
    {
        this.totalDiamondsInMap = 10;
    }

    create() {
        let map = this.make.tilemap({key: 'map', tileWidth: 32, tileHeight: 32}); // Create the tilemap with the specified tile dimensions
        let tileSet = map.addTilesetImage('tiles'); // Map the correct part of the tiles image to the tilemap

        layer = map.createLayer(0, tileSet); // Draw the tiles on the screen

        let tile = layer.getTileAtWorldXY(64, 32); // Retrieve a specific tile based on a world position

        // Having the player added to the game
        this.player = this.physics.add.sprite(32+16, 32+16, 'player').setScale(0.14);

        // Creating a group of diamonds
        diamonds = this.physics.add.group({
            key: 'gem',
            repeat: this.totalDiamondsInMap - 1,
            setXY: {x: 112, y: 48, stepX: 64, stepY: 32}
        });

        // Scope each diamond
        diamonds.children.iterate(function (child) {
            child.setScale(0.2);
        });

        // How many diamonds have been collected
        this.diamondCount = 0;

        // Displayed diamond counter
        diamondCounter = this.add.text(-50, -140, `Gems: ${this.diamondCount}/${this.totalDiamondsInMap}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        // Adding overalap between player and diamonds (collecting diamonds)
        this.physics.add.overlap(this.player, diamonds, this.hitDiamond, null, this); 

        tile.index = 0; // Update what image a tile should render as

        // Add used keys to the scene
        keys = this.input.keyboard.addKeys('W,S,A,D', true, true);

        // Create the animation for movement
        this.anims.create({
            key: 'up',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'down',
            frames: [ { key: 'player', frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: [ { key: 'player', frame: 2 } ],
            frameRate: 10
        });

        this.anims.create({
            key: 'left',
            frames: [ { key: 'player', frame: 3 } ],
            frameRate: 10
        });
        
        // Stick camera to the player
        this.cameras.main.startFollow(this.player);

        this.cameras.main.setBounds(-400, -400, 1880, 1320);

        this.seconds = 0;
        this.minutes = 0;

        // Draw HUD clock
        clock = this.add.text(-50, -100, `Time: ${this.seconds}:${this.minutes}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        // Actual clock
        timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });
    }

    // Update time and clock
    updateClock () {
        // Change time
        this.seconds++;
        if (this.seconds === 60) {
            this.minutes++;
            this.seconds = 0;
        }
        // Update clock text
        clock.setText(`Time: ${this.minutes}:${this.seconds}`);
    }

    // function that removes tile at the given tile index and adds 1 to the diamondCount
    // returns false, so it doesn't collide with the player
    hitDiamond (player, star) {

        star.disableBody(true, true);
        this.diamondCount += 1;

        console.log("Collected! Diamonds collected: " + this.diamondCount);

        diamondCounter.setText(`Gems: ${this.diamondCount}/${this.totalDiamondsInMap}`);

        if (this.diamondCount === this.totalDiamondsInMap) {
            diamondCounter.setText(`Go to next map!`);
        }
    }

    update() {
        if (this.input.keyboard.checkDown(keys.A, 200)) {            
                this.player.anims.play('left', true);
                let tile = layer.getTileAtWorldXY(this.player.x - 32, this.player.y,true);
    
                if (tile.index !== 2){
    
                    tile = layer.getTileAtWorldXY(this.player.x - 32, this.player.y,true);
                    this.player.x -= 32;
                    
    
                }
            
        } else if (this.input.keyboard.checkDown(keys.D, 200)) {
            this.player.anims.play('right', true);

                this.player.anims.play('right', true);

                let tile = layer.getTileAtWorldXY(this.player.x + 32, this.player.y,true);
    
                if (tile.index !== 2){
                    tile = layer.getTileAtWorldXY(this.player.x + 32, this.player.y,true);
                    this.player.x += 32;
                }
            

        } else if (this.input.keyboard.checkDown(keys.S, 200)) {
            this.player.anims.play('down', true);

            this.player.anims.play('down', true);

                let tile = layer.getTileAtWorldXY(this.player.x, this.player.y + 32,true);
    
                if (tile.index !== 2){
                    tile = layer.getTileAtWorldXY(this.player.x, this.player.y + 32,true);
                    this.player.y += 32;
    
                }


        } else if (this.input.keyboard.checkDown(keys.W, 200)) {
            this.player.anims.play('up', true);

                this.player.anims.play('up', true);

                let tile = layer.getTileAtWorldXY(this.player.x, this.player.y - 32,true);
    
                if (tile.index !== 2){
                    tile = layer.getTileAtWorldXY(this.player.x, this.player.y - 32,true);
                    this.player.y -= 32;
    
                }
        }
    }
}