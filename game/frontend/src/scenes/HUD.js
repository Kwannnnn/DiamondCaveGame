import CollectDiamond from "../events/CollectDiamondEvent";
import SelectHealingPerk from "../events/HealingPerkEvent";
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import { CST } from '../utils/CST';
import ChatScene from './ChatScene';



let numberOfSpectators=0;
export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: "hud"
        });

        this.fullWidth = 200;
        this.healthBarX = 50;
        this.healthBarY = 40;

        // Initial clock counts
        this.minutes = 0;
        this.seconds = 0;
    }

    init(data) {
        this.chatOn = false;
        this.chatMessages = [];

        this.world = data.world;
        this.stage = data.stage;
        this.socket = data.socket;
        this.collectedDiamonds = 0;
        this.totalDiamonds = data.totalDiamonds;
        
        // health in percentage
        this.currentHealth = 100;
    }

    preload() {
        //preloading assets for life-pool
        this.load.image('left-cap', 'assets/barHorizontal_green_left.png')
        this.load.image('middle', 'assets/barHorizontal_green_mid.png')
        this.load.image('right-cap', 'assets/barHorizontal_green_right.png')

        this.load.image('left-cap-shadow', 'assets/barHorizontal_shadow_left.png')
        this.load.image('middle-shadow', 'assets/barHorizontal_shadow_mid.png')
        this.load.image('right-cap-shadow', 'assets/barHorizontal_shadow_right.png')
        
        //preloading assets for chat
        this.load.image('chat', "assets/comment-message.png");
        this.load.html('form', 'assets/pages/form.html');

        // //preloading rexUI plugin
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
    }

    create() {
        // background shadow
        this.leftShadowCap = this.add.image(this.healthBarX, this.healthBarY, 'left-cap-shadow')
            .setOrigin(0, 0.5)

        this.middleShadowCap = this.add.image(this.healthBarX + this.leftShadowCap.width, this.healthBarY, 'middle-shadow')
            .setOrigin(0, 0.5)

        this.rightShadowCap = this.add.image(this.healthBarX + this.middleShadowCap.displayWidth, this.healthBarY, 'right-cap-shadow')
            .setOrigin(0, 0.5)

        this.leftCap = this.add.image(this.healthBarX, this.healthBarY, 'left-cap')
            .setOrigin(0, 0.5)

        this.middle = this.add.image(this.healthBarX + this.leftCap.width, this.healthBarY, 'middle')
            .setOrigin(0, 0.5)

        this.rightCap = this.add.image(this.healthBarX + this.middle.displayWidth, this.healthBarY, 'right-cap')
            .setOrigin(0, 0.5)

        

        // Value given in percentage
        this.setHealth(this.currentHealth);

        // Create the world and stage text
        this.gamestage = this.add.text(1000, 25, `World: ${this.world}-${this.stage}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        // Create the numberOfSpectstors and stage text
        this.numberOfSpectators = this.add.text(35, 80, ` Number of spectators: ${numberOfSpectators}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });
        this.socket.on('newSpectatorJoined',()=>{numberOfSpectators+=1; console.log("Success "+numberOfSpectators);this.updateNumberOfSpectators(numberOfSpectators);})

        // Create the Diamond counter
        this.diamondCounter = this.add.text(600, 25, `Gems: ${this.collectedDiamonds}/${this.totalDiamonds}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        // Create the clock
        this.clock = this.add.text(300, 25, `Time: ${this.seconds}:${this.minutes}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        // Create chat interface
        // chat icon
        this.chatButton = this.add.sprite(40, 680, 'chat')
            .setDepth(1)
            .setOrigin(0.5)
            .setScale(1.5)
            .setInteractive();
        // chat input
        this.chatButton.on('pointerdown', () => {
            // open chatbox
            if (!this.chatOn) { 
                this.scene.add(CST.SCENES.CHAT, ChatScene, true, { socket: this.socket });
                this.chatOn = !this.chatOn;
            }
            // close chatbox
            else {
                this.scene.remove(CST.SCENES.CHAT);
                this.chatOn = !this.chatOn;
            }
        });
        this.chatButton.on('pointerover', () => {this.chatButton.setTint(0x30839f);});
        this.chatButton.on('pointerout', () => {this.chatButton.clearTint();});

        // Clock
        this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });

        // Diamond collection
        CollectDiamond.on('update-count', this.updateDiamondCount, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            CollectDiamond.off('update-count', this.updateDiamondCount, this);
        });

        SelectHealingPerk.on('heal', this.setHealthAnimated, this);
    }

    // The difference between setting and changing health is that changing is relative, while setting is absolute
    // Setting to +20 makes the player's health 20%
    // Changing to +20 makes the player's health equal to their current health + 20
    changeHealth(difference) {
        this.setHealth(this.middle.displayWidth + difference);
        this.updateHealth(difference);
        console.log("Teams health is: " + this.currentHealth);
    }

    changeHealthAnimated(difference) {
        this.setHealthAnimated(this.middle.displayWidth + difference);
    }

    setHealth(percentage) {
        this.middle.displayWidth = this.fullWidth * (percentage / 100);
        this.rightCap.x = this.middle.x + this.middle.displayWidth;
    }

    setHealthAnimated(percentage) {
        this.tweens.update({
            targets: this.middle,
            displayWidth: this.fullWidth * (percentage / 100),
            duration: 1000,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: () => {
                this.rightCap.x = this.middle.x + this.middle.displayWidth
                this.leftCap.visible = this.middle.displayWidth > 0
                this.middle.visible = this.middle.displayWidth > 0
                this.rightCap.visible = this.middle.displayWidth > 0
            }
        });
    }

    // Update time and clock
    updateClock () {
        this.seconds++;
        if (this.seconds === 60) {
            this.minutes++;
            this.seconds = 0;
        }

        this.clock.setText(`Time: ${this.minutes}:${this.seconds}`);
    }

    updateDiamondCount(count) {
        this.collectedDiamonds = count;

        if (this.collectedDiamonds === this.totalDiamonds) {
            this.diamondCounter.setText(`Go to next map!`);
        } else {
            this.diamondCounter.setText(`Gems: ${this.collectedDiamonds}/${this.totalDiamonds}`);
        }        
    }

    updateHealth(health) {
        this.currentHealth += health;
    }

    updateNumberOfSpectators(numberOfSpectators) {
        this.numberOfSpectators.setText(` Number of spectators: ${numberOfSpectators}`);
    }

}