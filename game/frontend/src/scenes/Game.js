import Phaser from 'phaser';
import { CST } from '../utils/CST';

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
        //this.load.image("exit", "assets/exit.png")
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 154, frameHeight: 276});

        this.load.image('tiles', 'assets/tiles.png'); // These are all the tiles that can be mapped toa number in the tilemap CSV file
        this.load.tilemapCSV('map', 'assets/tileMap.csv'); // CSV representation of the map
    }

    init(data) {
        this.collectedDiamonds = 0;

        //the ideal delay for the normal speed to begin with is 200
        this.delay = 200;

        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        this.username = data.username;
        this.initialGameState = data.initialGameState;
        console.log(this.initialGameState);
        this.socket.on('gemCollected', (diamond) => this.handleDiamondCollected(diamond));

    }

    create() {
        let map = this.make.tilemap({key: 'map', tileWidth: 32, tileHeight: 32}); // Create the tilemap with the specified tile dimensions
        let tileSet = map.addTilesetImage('tiles'); // Map the correct part of the tiles image to the tilemap

        layer = map.createLayer(0, tileSet); // Draw the tiles on the screen

        // Add the HUD scene
        this.scene.add('hud', HUD, true, {world: 1, stage: 1, totalDiamonds: this.initialGameState.gems.length});

        this.players = new Map();
        this.names = new Map();
        // Having the player added to the game
        this.initialGameState.players.forEach(p => {
            var player =  this.physics.add.sprite(p.x, p.y, 'player').setScale(0.14)
            this.players.set(p.playerId, player);
            var name = this.add.text(p.x-5,p.y-10,p.playerId);
            this.names.set(p.playerId, name);
            this.setNamePosition(name, player);
        });

        this.player = this.players.get(this.username);
        this.name = this.names.get(this.username);
        this.setupPlayerMovement();

        this.diamonds = this.physics.add.group();

        // Send the new player position to the server on key release
        // This happens on ANY key release that is part of the scene input
        // this.input.keyboard.on('keyup', this.handlePlayerMoved.bind(this));
        
        // Stick camera to the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(-400, -400, 1880, 1320);

        this.setupDiamondLocations();

        this.socket.on('teammateMoved', (args) => {
            console.log(args);
            let p = this.players.get(args.playerId);
            let name = this.names.get(args.playerId);
            p.x = args.x;
            p.y = args.y;
            p.orientation =  args.orientation;
            this.setNamePosition(name, p);

            switch(p.orientation){
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
        });

        /*this.setupDiamondLocations(this.totalDiamonds);

        this.placeExit(200,300);

        this.player.depth = 100;*/
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
            this.player.orientation = 180;
        } else if (this.input.keyboard.checkDown(this.keys.D, this.delay)) {
            this.player.anims.play('right', true);
            movementX = 32;
            this.player.orientation = 0;
        } else if (this.input.keyboard.checkDown(this.keys.S, this.delay)) {
            this.player.anims.play('down', true);
            movementY = 32;
            this.player.orientation = 270;
        } else if (this.input.keyboard.checkDown(this.keys.W, this.delay)) {
            this.player.anims.play('up', true);
            movementY = -32;
            this.player.orientation = 90;
        }

        // Check tile we are attempting to move to
        let tile = layer.getTileAtWorldXY(this.player.x + movementX, this.player.y + movementY, true);

        if (tile && tile.index !== 2) {
            this.player.x = this.player.x + movementX;
            this.player.y = this.player.y + movementY;
            this.setNamePosition(this.name, this.player);
        }

        if(movementX !== 0 || movementY !== 0)
        this.socket.emit('playerMove', {
            roomId: this.lobbyID,
            x: this.player.x,
            y: this.player.y,
            orientation: this.player.orientation
        });
    }

    setNamePosition(name,player){
        name.x = player.x - 20;
        name.y = player.y - 40;
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

    setupDiamondLocations() {
        this.initialGameState.gems.forEach(g => {
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

        // Adding overalap between player and diamonds (collecting diamonds)
        this.physics.add.overlap(this.player, this.diamonds, this.collectDiamond, null, this); 
    }

    /*placeExit(x, y){
        this.exit = this.physics.add.sprite(x, y, "exit");
        this.physics.add.overlap(this.player, this.exit, ()=>{
            this.exitScene()
            this.exit.disableBody(false,false)
        }, this.canExitScene, this)
    }
    canExitScene(){
        if(this.collectedDiamonds == this.totalDiamonds){
            return true;
        }else{
            console.log("Not all diamonds have been collected!")
            return false;
        }
    }
    exitScene(){
        console.log("Exit! Logic neends to be implemented.")
    }*/


    /**
     * this is a perk for increasing the movement speed
     */
    increaseSpeed(){
        this.delay=this.delay*7/10;
    }


    /**
     * this is a perk for adding 4 more diamonds into the number of collected diamonds
     */
    diamondPerk(){
        this.collectedDiamonds+=4;
    }


    /**
     * this perk for reducing 10 seconds for the team
     */
    timePerk(){
        if(HUD.second<10){
            HUD.minute--;
            HUD.second+=60;
            HUD.second-=10;
        }else{
            HUD.second-=10;
        }
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

    // Restore health to the player
    // This could be any sort of healing, just pass the health change in percentage
    changeHealth(healthChange) {
        HUD.changeHealth(healthChange);
    }
}