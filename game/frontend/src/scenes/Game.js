import Phaser from 'phaser';

let player;
let keys;
let layer;
let keyCombo;

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');

        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 154, frameHeight: 276});

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map
    }

    create() {
        let map = this.make.tilemap({key: 'map', tileWidth: 32, tileHeight: 32}); // Create the tilemap with the specified tile dimensions
        let tileSet = map.addTilesetImage('tiles'); // Map the correct part of the tiles image to the tilemap

        layer = map.createLayer(0, tileSet); // Draw the tiles on the screen

        let tile = layer.getTileAtWorldXY(64, 32); // Retrieve a specific tile based on a world position
        this.add.image(240, 240, 'gem').setScale(0.25); // Add an image over top (The scale is just because this specific image dimensions are large)

        tile.index = 0; // Update what image a tile should render as

        // Having the player added to the game
        player = this.physics.add.sprite(32+16, 32+16, 'player').setScale(0.15);

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
        this.cameras.main.startFollow(player);

        this.cameras.main.setBounds(-400, -400, 1880, 1320);

    }

    update() {

        if (this.input.keyboard.checkDown(keys.A, 200)) {
            
                player.anims.play('left', true);
                let tile = layer.getTileAtWorldXY(player.x - 32, player.y,true);
    
                if (tile.index !== 2){
    
                    player.x -= 32;
                    
    
                }
            
        } else if (this.input.keyboard.checkDown(keys.D, 200)) {

                player.anims.play('right', true);

                let tile = layer.getTileAtWorldXY(player.x + 32, player.y,true);
    
                if (tile.index !== 2){
                    
                    player.x += 32;
                }
            

        } else if (this.input.keyboard.checkDown(keys.S, 200)) {

                player.anims.play('down', true);

                let tile = layer.getTileAtWorldXY(player.x, player.y + 32,true);
    
                if (tile.index !== 2){
                    
                    player.y += 32;
    
                }


        } else if (this.input.keyboard.checkDown(keys.W, 200)) {

                player.anims.play('up', true);

                let tile = layer.getTileAtWorldXY(player.x, player.y - 32,true);
    
                if (tile.index !== 2){
                    
                    player.y -= 32;
    
                }
            

        }
        
    
        
    }
    
}