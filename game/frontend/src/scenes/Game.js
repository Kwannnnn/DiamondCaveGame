import Phaser from 'phaser';

let keys;
let layer;
let coinLayer;
let diamonds;


let gamestageOffsets = {
    x: 350,
    y: -350,
}

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    preload() {
        this.load.image('gem', 'assets/gem.png');

        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 154, frameHeight: 276});

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map

        //preloading assets for lifepool
        this.load.image('left-cap', 'assets/barHorizontal_green_left.png')
        this.load.image('middle', 'assets/barHorizontal_green_mid.png')
        this.load.image('right-cap', 'assets/barHorizontal_green_right.png')

        this.load.image('left-cap-shadow', 'assets/barHorizontal_shadow_left.png')
        this.load.image('middle-shadow', 'assets/barHorizontal_shadow_mid.png')
        this.load.image('right-cap-shadow', 'assets/barHorizontal_shadow_right.png')
    }


    init(data)
    {
        this.fullWidth = 300

        this.world = data.world;
        this.stage = data.stage;
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
            repeat: 7,
            setXY: {x: 112, y: 48, stepX: 64, stepY: 32}
        });

        // Scope each diamond
        diamonds.children.iterate(function (child) {
            child.setScale(0.2);
        });

        this.diamondCounter = 0;

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

        //life pool
        const y = -50
        const x = -50

        // background shadow
        const leftShadowCap = this.add.image(x, y, 'left-cap-shadow')
            .setOrigin(0, 0.5)

        const middleShaddowCap = this.add.image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow')
            .setOrigin(0, 0.5)
        middleShaddowCap.displayWidth = this.fullWidth

        this.add.image(middleShaddowCap.x + middleShaddowCap.displayWidth, y, 'right-cap-shadow')
            .setOrigin(0, 0.5)

        this.leftCap = this.add.image(x, y, 'left-cap')
            .setOrigin(0, 0.5)

        this.middle = this.add.image(this.leftCap.x + this.leftCap.width, y, 'middle')
            .setOrigin(0, 0.5)

        this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
            .setOrigin(0, 0.5)

        this.setMeterPercentage(1)

        // Create the world and stage text
        this.gamestage = this.add.text(this.cameras.main.x + gamestageOffsets.x, this.cameras.main.y + gamestageOffsets.y, `World: ${this.world}: ${this.stage}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        this.gamestage.fixedToCamera = true;
    }

    // function that removes tile at the given tileindex and adds 1 to the diamondCounter
    // returns false so it doesnt collide with the player
    // diamondCOunter is not shown at the moment
    hitDiamond (player, star){

        star.disableBody(true, true);
        this.diamondCounter += 1;

        console.log("Collected! Diamonds collected: " + this.diamondCounter);
            
    }

    setMeterPercentage(percent = 1)
    {
        const width = this.fullWidth * percent

        this.middle.displayWidth = width
        this.rightCap.x = this.middle.x + this.middle.displayWidth
    }

    setMeterPercentageAnimated(percent = 1, duration = 1000)
    {
        const width = this.fullWidth * percent

        this.tweens.add({
            targets: this.middle,
            displayWidth: width,
            duration,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: () => {
                this.rightCap.x = this.middle.x + this.middle.displayWidth

                this.leftCap.visible = this.middle.displayWidth > 0
                this.middle.visible = this.middle.displayWidth > 0
                this.rightCap.visible = this.middle.displayWidth > 0
            }
        })
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

        // Update the game stage text position
        this.gamestage.x = this.cameras.main.midPoint.x + gamestageOffsets.x;
        this.gamestage.y = this.cameras.main.midPoint.y + gamestageOffsets.y;
    }
}