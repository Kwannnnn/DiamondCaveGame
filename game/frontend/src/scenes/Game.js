import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');
        this.load.image('player', 'assests/redDot.png');

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map
    }

    create() {
        let map = this.make.tilemap({key: 'map', tileWidth: 32, tileHeight: 32}); // Create the tilemap with the specified tile dimensions
        let tileSet = map.addTilesetImage('tiles'); // Map the correct part of the tiles image to the tilemap

        let layer = map.createLayer(0, tileSet); // Draw the tiles on the screen

        let tile = layer.getTileAtWorldXY(64, 32); // Retrieve a specific tile based on a world position
        this.add.image(240, 240, 'gem').setScale(0.25); // Add an image over top (The scale is just because this specific image dimensions are large)

        tile.index = 0; // Update what image a tile should render as

        // Having the player added to the game

        let player = this.physics.add.image(32+16, 32+16, 'player');

        // let sprite = this.physics.add.sprite(32+16, 32+16, 'player');

        // Stick camera to the player
        this.cameras.main.startFollow(player);

        this.cameras.main.setBounds(-400, -400, 1880, 1320);
        

        this.input.keyboard.on('keydown-A', function(event){
            let tile = layer.getTileAtWorldXY(player.x - 32, player.y,true);


            // if player.x < pla

            if (tile.index !== 2){
                player.x -= 32;
                player.angle = 180;
            }
        })

        this.input.keyboard.on('keydown-D', function(event){
            var tile = layer.getTileAtWorldXY(player.x + 32, player.y,true);

            if (tile.index !== 2){
                player.x += 32;
                player.angle = 0;
            }
        })

        this.input.keyboard.on('keydown-S', function(event){
            var tile = layer.getTileAtWorldXY(player.x, player.y + 32,true);

            if (tile.index !== 2){
                player.y += 32;
                player.angle = 90;
            }
        })

        this.input.keyboard.on('keydown-W', function(event){
            var tile = layer.getTileAtWorldXY(player.x, player.y - 32,true);

            if (tile.index !== 2){
                player.y -= 32;
                player.angle = -90;
            }
        })


    }
}