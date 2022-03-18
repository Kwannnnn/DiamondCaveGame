import Phaser from 'phaser';
import { CST } from '../utils/CST';

let lobbyID;
let playerIDs = [];
const SERVER_URL = 'localhost:3000'; //TODO: Change to VPS URL
const usernameForm = '<input type="text" name="username" placeholder="Enter username"/>';

export default class SpectatorJoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.SPECTATORJOIN
        });
    }

    init() {

    }

    create() {
        this.logo = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0)

        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();

        this.backButton.on('pointerdown', () => {this.scene.start(CST.SCENES.MENU);});
        this.backButton.on('pointerover', () => {this.backButton.setTint(0x30839f);});
        this.backButton.on('pointerout', () => {this.backButton.clearTint();});

        this.usernameForm = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 350).createFromHTML(usernameForm);
        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, lobbyID === undefined ? 'Connect' : 'Start game', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        this.actionButton.on('pointerdown', () => this.connect());
        this.actionButton.on('pointerover', () => {this.actionButton.setTint(0x30839f);});
        this.actionButton.on('pointerout', () => {this.actionButton.clearTint();});

        // this.socket.on('currentPlays', () => {
        //     this.scene.start(CST.SCENES.ACTIVEGAMES, {
        //         world: 1,
        //         stage: 1,
        //         socket: this.socket,
        //         username: this.username,
        //         lobbyID: lobbyID,
        //         initialGameState: payload
        //     });
        // });
    }

    connect(){
        this.username = this.usernameForm.getChildByName('username').value;
        this.socket = io(SERVER_URL, {query: 'username=' + this.username, reconnection: false});
        this.socket.on('connect_error', ()=>{this.message.setText('Could not connect to server');});
        this.socket.on('connect', ()=>{
            console.log("Connection was successful")
        });
        this.socket.emit('getCurrentGames');

        this.socket.on('currentGames', (payload) => {
            // console.log(payload);
            // this.scene.start(CST.SCENES.ACTIVEGAMES,{
            //     plays:payload
            // });
            console.log(payload);

            this.showCurrentGames(payload)
        });

        this.socket.on('runGameScene',(roomId,gameState)=>{
            console.log(roomId);
            console.log(gameState);
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: 1,
                socket: this.socket,
                username: this.username,
                lobbyID: roomId,
                initialGameState: gameState
            });
        });
    }

    showCurrentGames(payload) {
        this.logo.destroy();
        this.usernameForm.destroy();
        this.message = this.add.text(this.game.renderer.width / 2, 100, 'All active games: ', {
            color: '#FFFFFF',
            fontSize: 50
        }).setOrigin(0.5);

        let yPosition = 180;

        this.header = this.add.text()
        for (let room of payload) {
            // create a new row
            this.message = this.add.text(300, yPosition, room.roomId + "(" + room.playerIds.join(', ') + ")", {
                color: '#FFFFFF',
                fontSize: 40
            }).setOrigin(0.5);

            const spectateButton = this.add.text(1000, yPosition, 'Spectate', {
                color: '#FFFFFF',
                fontSize: 40
            }).setOrigin(0.5).setInteractive();

            spectateButton.on('pointerdown', () => this.socket.emit('joinRoomAsSpectator', room.roomId));
            spectateButton.on('pointerover', () => {spectateButton.setTint(0x30839f);});
            spectateButton.on('pointerout', () => {spectateButton.clearTint();});

            yPosition += 55
        }
    }


}
