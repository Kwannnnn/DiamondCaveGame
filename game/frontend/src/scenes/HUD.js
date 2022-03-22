import CollectDiamond from '../events/CollectDiamondEvent';
import SelectHealingPerk from '../events/HealingPerkEvent';
import { CST } from '../utils/CST';
import ChatScene from './ChatScene';

const MARGIN_X = 32;
const MARGIN_Y = 16;
let numberOfSpectators = 0;
export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: 'hud'
        });

        this.fullWidth = 179;

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
        this.load.image('middle', 'assets/barHorizontal.png');
        this.load.image('right-cap', 'assets/barHorizontal_right.png');
        this.load.image('health', 'assets/healthOverlay.png');
        this.load.image('gem', 'assets/gem.png');
        this.load.image('timer-bg', 'assets/window_message_box.png');
        
        //preloading assets for chat
        this.load.image('chat', 'assets/comment-message.png');
        this.load.html('form', 'assets/pages/form.html');
        // //preloading rexUI plugin
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
    }

    create() {
        this.healthBarNew = this.add.image(MARGIN_X, MARGIN_Y, 'health')
            .setOrigin(0, 0)
            .setScale(0.2)
            .setDepth(100);

        this.gem = this.add.image(MARGIN_X, 3 * MARGIN_Y, 'gem')
            .setOrigin(0, 0)
            .setScale(0.2)
            .setDepth(100);

        this.timerBg = this.add.image(this.game.renderer.width / 2, MARGIN_Y, 'timer-bg')
            .setDepth(100);

        this.middle = this.add.image(1.5 * MARGIN_X, MARGIN_Y + 4, 'middle')
            .setOrigin(0, 0.0)
            .setScale(0.6)

        this.rightCap = this.add.image(1.5 * MARGIN_X + this.middle.displayWidth, MARGIN_Y + 4, 'right-cap')
            .setOrigin(0, 0.0)
            .setScale(0.6)

        // Value given in percentage
        this.setHealth(this.currentHealth);

        // Create the world and stage text
        this.gamestage = this.add.text(this.game.renderer.width - 1.5 * MARGIN_X, 2.5 * MARGIN_Y, `World: ${this.world}-${this.stage}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(1, 1);

        // Create the numberOfSpectstors and stage text
        this.numberOfSpectators = this.add.text(this.game.renderer.width - 1.5 * MARGIN_X, 4.5 * MARGIN_Y, `Spectators: ${numberOfSpectators}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(1, 1);

        this.socket.on('newSpectatorJoined', ()=>{
            numberOfSpectators += 1; console.log('Success ' + numberOfSpectators); this.updateNumberOfSpectators(numberOfSpectators);
        })

        // Create the Diamond counter
        this.diamondCounter = this.add.text(MARGIN_X + 32, 3 * MARGIN_Y + 2, `${this.collectedDiamonds}/${this.totalDiamonds}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(0, 0);

        // Create the clock
        this.clock = this.add.text(this.game.renderer.width / 2 - 36, MARGIN_Y, `${this.seconds}:${this.minutes}`, {
            color: '#FFFFFF',
            fontSize: 40,
        })
            .setOrigin(0, 0)
            .setDepth(101);

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
            } else {
                // close chatbox
                this.scene.remove(CST.SCENES.CHAT);
                this.chatOn = !this.chatOn;
            }
        });
        this.chatButton.on('pointerover', () => {
            this.chatButton.setTint(0x30839f);
        });
        this.chatButton.on('pointerout', () => {
            this.chatButton.clearTint();
        });

        // Clock
        this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });

        // Diamond collection
        CollectDiamond.on('update-count', this.updateDiamondCount, this);

        this.events.on(Phaser.Scenes.Events.DESTROY, () => {
            console.log('Event listener is disconnected');
            CollectDiamond.off('update-count', this.updateDiamondCount, this);
        });

        SelectHealingPerk.on('heal', this.setHealthAnimated, this);
    }


    // The difference between setting and changing health is that changing is relative, while setting is absolute
    // Setting to +20 makes the player's health 20%
    // Changing to +20 makes the player's health equal to their current health + 20
    changeHealth(difference) {
        this.setHealth(this.currentHealth + difference);
        this.currentHealth += difference;
        console.log('Teams health is: ' + this.currentHealth);
    }

    changeHealthAnimated(difference) {
        this.setHealthAnimated(this.currentHealth + difference);
        this.currentHealth += difference;
        console.log('Teams health is: ' + this.currentHealth);
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
                this.middle.visible = this.middle.displayWidth > 0
                this.rightCap.visible = this.middle.displayWidth > 0
            }
        });
    }

    // Update time and clock
    updateClock() {
        this.seconds++;

        if (this.seconds === 60) {
            this.minutes++;
            this.seconds = 0;
        }

        if (this.seconds <= 9) {
            this.clock.setText(`${this.minutes}:0${this.seconds}`);
        } else {
            this.clock.setText(`${this.minutes}:${this.seconds}`);
        }
    }

    updateDiamondCount(count) {
        this.collectedDiamonds = count;

        if (this.collectedDiamonds === this.totalDiamonds) {
            this.diamondCounter.setText('Go to next map!');
        } else {
            // console.log(this.collectedDiamonds);
            this.diamondCounter.setText(`${this.collectedDiamonds}/${this.totalDiamonds}`);
        }        
    }

    updateNumberOfSpectators(numberOfSpectators) {
        this.numberOfSpectators.setText(`Spectators: ${numberOfSpectators}`);
    }

}