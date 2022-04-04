import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { Header } from '../components';
import ChatScene from './ChatScene';

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

        console.log(this.scene);

    }

    preload() {
        this.load.image('bloodStone', 'assets/perk_sprites/BloodStone.png');
        this.load.image('heart', 'assets/perk_sprites/Heart.png');
        this.load.image('speedBoots', 'assets/perk_sprites/SpeedBoots.png');
        this.load.image('bloodStoneChosen', 'assets/perk_sprites/BloodStone_Chosen.png');
        this.load.image('heartChosen', 'assets/perk_sprites/Heart_Chosen.png');
        this.load.image('speedBootsChosen', 'assets/perk_sprites/SpeedBoots_Chosen.png');

        this.load.audio('choosePerk', ['assets/sound_effects/choosing-perk-tik.mp3']);
    }

    create() {
        this.choosePerkSound = this.sound.add('choosePerk');
        this.choosePerkSound.play();

        this.setupChat();
        // Set background to black and add title
        new Header(this, this.game.renderer.width / 2, 200, 'Choose a perk');
        
        this.runTimer();

        // Create perk text objects from the list received from server
        this.perks = [];
        const startPos = this.game.renderer.width / 2 - 80;
        for (let i = 0; i < this.perksNames.length; i++) {
            //Get texture for perk sprite
            let perkTexture = this.selectPerkTexture(this.perksNames[i], false);
            if (perkTexture === null) return;

            //Render and set properties for perk sprite
            let perkButton = this.add.sprite(startPos + 100 * i, this.game.renderer.height / 2, perkTexture).setOrigin(0.5).setInteractive();
            perkButton.on('pointerdown', () => {
                this.selectPerk(i);
            });
            perkButton.perkName = this.perksNames[i];

            this.perks.push(perkButton);
        }

        // Display user's choice
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'Your Choice:', { fontSize:30 }).setOrigin(0.5);
        this.playerChoice = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 140, 'None', { fontSize:25 }).setOrigin(0.5);

        // Display teammate's choice
        this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 220, 'Teammate Choice:', { fontSize:30 }).setOrigin(0.5);
        this.teammateChoice = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 260, 'None', { fontSize:25 }).setOrigin(0.5);
        
        this.createListeners();
    }

    createListeners() {
        this.socket.on('teammatePerkChoice', (teammatePerk) => {
            this.teammateChoice.setText(teammatePerk.teammatePerk);
        })

        // Wait for final perk to be sent from server (now it only listens to movement perk)
        this.socket.on('perkForNextGame', (args) => {
            this.scene.remove(CST.SCENES.CHAT);
            this.socket.removeAllListeners();
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: 2,  
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
            perk.setTexture(this.selectPerkTexture(perk.perkName, false));
        });

        // Send chosenPerk message to server 
        this.socket.emit('chosenPerk', { username: this.username, perkId: perkId, lobbyID: this.lobbyID });
        this.perks[perkId].setTexture(this.selectPerkTexture(this.perks[perkId].perkName, true));

        this.playerChoice.setText(this.perks[perkId].perkName);
    }

    selectPerkTexture(perkName, isSelected) {
        switch (perkName) {
            case 'Movement Speed':
                return isSelected ? 'speedBootsChosen' : 'speedBoots';
            case 'Health':
                return isSelected ? 'heartChosen' : 'heart';
            case 'Add Diamonds':
                return isSelected ? 'bloodStoneChosen' : 'bloodStone';
            default:
                console.error('Unknown perk');
                return null;
        }
    }

    setupChat() {
        this.scene.add(CST.SCENES.CHAT, ChatScene, true, {
            socket: this.socket
        });
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