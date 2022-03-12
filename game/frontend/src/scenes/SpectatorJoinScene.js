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
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
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
            // this.showCurrentGames(payload)
        });
    }

    showCurrentGames() {
        this.usernameForm.destroy();
        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 425, 'All active games: ', {
            color: '#FFFFFF',
            fontSize: 60
        }).setOrigin(0.5);

        let position = this.game.renderer.height - 370;
        for (let i = 0; i < this.plays.length; i++) {
            let listOfPlayers = "";
            for (let k = 0; k < this.plays[i].players.length; k++) {
                listOfPlayers += this.plays[i].players[k]
                if (k + 1 !== this.plays[i].players.length) {
                    listOfPlayers += ',';
                }
            }
            this.message = this.add.text(this.game.renderer.width / 2, position, this.plays[i].id + "(" + listOfPlayers + ")", {
                color: '#FFFFFF',
                fontSize: 60
            }).setOrigin(0.5);
            position += 55
        }
    }


}
