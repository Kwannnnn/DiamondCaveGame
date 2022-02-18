import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');

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

    }
}