import Phaser from 'phaser';
import { CST } from '../CST';

const SERVER_URL = 'localhost:3000'; //TODO: Change to VPS URL
const usernameForm = '<input type="text" name="username" placeholder="Enter username"/>';
let lobbyID;

export default class JoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOBBY
        });
    }

    init(data){
        console.log(data);
        if (data === undefined || data.lobbyID === undefined) return;
        lobbyID = data.lobbyID;
    }

    create() {

        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0,0, 'title_bg').setOrigin(0).setDepth(0);

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 350, 'Disconnected', {
            color: '#FFFFFF',
            fontSize: 60
        }).setOrigin(0.5);

        this.usernameFormObject = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);

        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 150, lobbyID === undefined ? 'Connect' : 'Start game', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        if (lobbyID === undefined) this.actionButton.on('pointerdown', () => {this.connect();});
        else {
            //TODO: Disable button until both players are connected
            this.actionButton.on('pointerdown', () => {this.scene.start(CST.SCENES.GAME, {world: 1, stage: 1});});
            this.displayCode(lobbyID);
        }
        this.actionButton.on('pointerover', () => {this.actionButton.setTint(0x30839f);});
        this.actionButton.on('pointerout', () => {this.actionButton.clearTint();});

        //TODO: Write lobby player display and refresh code
    }

    connect(){
        let ip = 'http://'+SERVER_URL;
        let username = this.usernameFormObject.getChildByName('username').value;
        if (username === ''){
            this.message.setText('Please enter a username');
            return;
        }

        this.message.setText('Connecting to:'+ip);
        this.socket = io(SERVER_URL, {query: 'username='+username ,reconnection: false});

        this.socket.on('connect', ()=>{this.createLobby();});

        this.socket.on('roomCreated', (args)=>{this.displayCode(args);});

        this.socket.on('connect_error', ()=>{this.displayError();});
    }

    createLobby(){
        this.socket.emit('createRoom');
    }

    displayCode(args){
        lobbyID = args;
        this.message.setText('Lobby code: '+args);
        this.actionButton.setText('Start game');
        this.actionButton.off('pointerdown');
        this.actionButton.on('pointerdown', () => {this.scene.start(CST.SCENES.GAME, {world: 1, stage: 1});});
        this.usernameFormObject.destroy();
    }

    displayError(){
        this.message.setText('Could not connect!');
    }
}
