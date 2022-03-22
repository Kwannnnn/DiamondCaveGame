import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { Header } from '../components';

/*
    This scene is run after the team finishes the map. Here the perk for the next map is chosen.
*/
export default class PerkMenu extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PERKS
        })
    }

    init(data) {
        this.perksNames = data.perksNames;
        this.username = data.username;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;

        // Only for testing
        this.gameState = data.gameState;
    }

    preload() {
        this.load.image('bloodStone', 'assets/perk_sprites/BloodStone.png');
        this.load.image('heart', 'assets/perk_sprites/Heart.png');
        this.load.image('speedBoots', 'assets/perk_sprites/SpeedBoots.png');
    }

    create() {
        // Set background to black and add title
        this.cameras.main.setBackgroundColor('black');
        new Header(this, this.game.renderer.width / 2, 100, 'Choose a perk');
        
        this.runTimer();

        // Create perk text objects from the list received from server
        this.perks = [];
        const startPos = this.game.renderer.width / 2 - 80;
        for (let i = 0; i < this.perksNames.length; i++) {
            let perkButton;
            switch (this.perksNames[i]) {
                case 'Movement Speed':
                    perkButton = this.add.sprite(startPos + 100 * i, this.game.renderer.height / 2, 'speedBoots').setOrigin(0.5).setInteractive();
                    break;
                case 'Health':
                    perkButton = this.add.sprite(startPos + 100 * i, this.game.renderer.height / 2, 'heart').setOrigin(0.5).setInteractive();
                    break;
                case 'Add Diamonds':
                    perkButton = this.add.sprite(startPos + 100 * i, this.game.renderer.height / 2, 'bloodStone').setOrigin(0.5).setInteractive();
                    break;
                default:
                    console.error('Unknown perk');
                    break;
            }
            if (perkButton !== undefined) {
                perkButton.on('pointerdown', () => {
                    this.selectPerk(i);
                });
                this.perks.push(perkButton);
            }
        }

        // Display teammate's choice
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 180, 'Teammate Choice:', { fontSize:30 }).setOrigin(0.5);
        this.teammateChoice = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 220, 'None', { fontSize:25 }).setOrigin(0.5);
        this.displayTeammatePerk();

        // Wait for final perk to be sent from server (now it only listens to movement perk)
        this.socket.on('perkForNextGame', (args) => {
            this.scene.stop(this);
            this.scene.start(CST.SCENES.GAME, {
                username: this.username,
                initialGameState: args.gameState,
                lobbyID: this.lobbyID,
                socket: this.socket,
                perk: args.perk
            });
        })
    }

    // Even that is getting called by clicking on the perk text
    selectPerk(perkId) {
        this.perks.forEach(perk => {
            perk.tint = 0xffffff;
        });

        // Send chosenPerk message to server 
        this.socket.emit('chosenPerk', { username: this.username, perkId: perkId, lobbyID: this.lobbyID });
        this.perks[perkId].tint = 0x00FF00;
    }

    displayTeammatePerk() {
        this.socket.on('teammatePerkChoice', (teammatePerk) => {
            this.teammateChoice.destroy();
            this.teammateChoice = this.add.text(900, 340, teammatePerk.teammatePerk, { fontSize:25 });
        })
    }

    runTimer() {
        // Start the timer
        this.timer = 10;
        this.countDown = this.add.text(this.game.renderer.width / 2, 150, this.timer, {
            fontSize: 50,
            fontStyle:'bold',
        }).setOrigin(0.5);

        // this.countDownTimer = this.time.addEvent({
        //     callback:()=>{
        //         if (this.timer > 0) {
        //             this.timer--;
        //             this.countDown.setText(this.timer);
        //             if (this.timer < 1) {
        //                 console.log('timer hit 0.');
        //                 // Sends message indicating that the time
        //                 // this.socket.emit('finishedPerkChoosing', this.lobbyID);
        //                 this.countDownTimer.remove();
        //             }
        //         }
        //     },
        //     callbackScope:this,
        //     delay:1000,
        //     loop:true
        // })
    }
}