import CollectDiamond from '../events/CollectDiamondEvent';
import LeaveMapEvent from '../events/LeaveMapEvent';
import { CST } from '../utils/CST';
import ChatScene from './ChatScene';

const MARGIN_X = 32;
const MARGIN_Y = 16;
export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.HUD
        });

        this.fullWidth = 179;
    }

    init(data) {
        this.chatOn = false;
        this.chatMessages = [];

        this.stage = data.stage;
        this.socket = data.socket;
        this.collectedDiamonds = data.gemsCollected;
        this.totalDiamonds = data.totalDiamonds;
        this.time = data.time;
        this.currentHealth = data.health;
        this.spectatorsCount = data.spectatorsCount;

    }

    preload() {
        //preloading assets for life-pool
        this.load.image('middle', 'assets/barHorizontal.png');
        this.load.image('right-cap', 'assets/barHorizontal_right.png');
        this.load.image('health', 'assets/healthOverlay.png');
        this.load.image('gem', 'assets/gem.png');
        this.load.image('timer-bg', 'assets/window_message_box.png');
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

        // At the start players have full health
        // so difference is 0
        this.changeHealth(0);

        // Create the world and stage text
        this.gamestage = this.add.text(this.game.renderer.width - 1.5 * MARGIN_X, 2.5 * MARGIN_Y, `Level: ${this.stage}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(1, 1);

        // Create the numberOfSpectstors and stage text
        this.numberOfSpectators = this.add.text(this.game.renderer.width - 1.5 * MARGIN_X, 4.5 * MARGIN_Y, `Spectators: ${this.spectatorsCount}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(1, 1);

        this.socket.on('newSpectatorJoined', ()=>{
            this.spectatorsCount++; 
            console.log('Success ' + this.spectatorsCount); 
            this.updateNumberOfSpectators(this.spectatorsCount);
        })

        // Create the Diamond counter
        this.diamondCounter = this.add.text(MARGIN_X + 32, 3 * MARGIN_Y + 2, `${this.collectedDiamonds}/${this.totalDiamonds}`, {
            color: '#FFFFFF',
            fontSize: 20,
        }).setOrigin(0, 0);

        // Create the clock
        this.clock = this.add.text(this.game.renderer.width / 2 - 36, MARGIN_Y, '0:00', {
            color: '#FFFFFF',
            fontSize: 40,
        }).setDepth(150);        

        // Clock
        // this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });

        // Diamond collection
        CollectDiamond.on('update-count', this.updateDiamondCount, this);

        this.events.on(Phaser.Scenes.Events.DESTROY, () => {
            console.log('Event listener is disconnected');
            CollectDiamond.off('update-count', this.updateDiamondCount, this);
            LeaveMapEvent.off('wait-for-player', this.notifyToWaitForSecondPlayerToLeave, this);
        });

        LeaveMapEvent.on('wait-for-player', this.notifyToWaitForSecondPlayerToLeave, this);
    }


    // The difference between setting and changing health is that changing is relative, while setting is absolute
    // Setting to +20 makes the player's health 20%
    // Changing to +20 makes the player's health equal to their current health + 20
    changeHealth(difference) {
        //update health bar on the hud
        const health = this.currentHealth + difference;

        if (health <= 0) {
            this.middle.destroy();
            this.rightCap.destroy();
        } else {
            let percentage = health * 0.01;
            if (percentage > 1) percentage = 1;

            this.middle.displayWidth = this.fullWidth * percentage;
            this.rightCap.x = this.middle.x + this.middle.displayWidth;
        }
        

        this.currentHealth += difference;
        console.log('Teams health is: ' + this.currentHealth);
    }

    changeHealthAnimated(difference) {
        this.setHealthAnimated(this.currentHealth + difference);
        this.currentHealth += difference;
        console.log('Teams health is: ' + this.currentHealth);
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
        this.diamondCounter.setText(`${this.collectedDiamonds}/${this.totalDiamonds}`);

        if (this.collectedDiamonds === this.totalDiamonds) {
            this.add.text(this.game.renderer.width / 2 + 140, MARGIN_Y + 100, 'Go to next map!', {
                color: '#FFFFFF',
                fontSize: 30,
            }).setOrigin(1, 1)
        }     
    }

    updateNumberOfSpectators(numberOfSpectators) {
        this.numberOfSpectators.setText(`Spectators: ${numberOfSpectators}`);
    }

    notifyToWaitForSecondPlayerToLeave() {
        this.diamondCounter.setText('Wait for the second player!');
    }

    setTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        if (seconds <= 9) {
            this.clock.setText(`${minutes}:0${seconds}`);
        } else {
            this.clock.setText(`${minutes}:${seconds}`);
        }

    }
}
