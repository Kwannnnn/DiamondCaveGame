import Phaser from 'phaser';
import { CST } from '../CST';

const SERVER_URL = 'localhost:3000'; //TODO: Change to VPS URL
const lobbyCodeForm = '<input type="text" name="lobby" placeholder="Enter lobby code"/>';
const usernameForm = '<input type="text" name="username" placeholder="Enter username"/>';

export default class JoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.JOIN
        });
    }

    preload() {

    }

    create() {

        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0,0, 'title_bg').setOrigin(0).setDepth(0);

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 350, 'Disconnected', {
            color: '#FFFFFF',
            fontSize: 60
        }).setOrigin(0.5);

        this.lobbyCodeInput = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 300).createFromHTML(lobbyCodeForm);
        this.username = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);

        this.joinButton = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 150,'join_button')
            .setInteractive()
            .on('pointerdown', () => {this.join();})
            .on('pointerover', () => {this.joinButton.setTint(0x30839f);})
            .on('pointerout', () => {this.joinButton.clearTint();});
    }

    join(){
        let lobby = this.lobbyCodeInput.getChildByName('lobby').value;
        let username = this.username.getChildByName('username').value;
        if (lobby === ''){
            this.message.setText('Please enter the lobby code');
            return;
        }
        if (lobby.length != 6){
            this.message.setText('Incorrect room code');
            return;
        }
        lobby = lobby.toUpperCase();
        if (username === ''){
            this.message.setText('Please enter a username');
            return;
        }
        this.message.setText('Connecting to lobby:'+lobby);
        this.socket = io(SERVER_URL, {query: 'username='+username, reconnection: false});

        this.socket.on('connect_error', ()=>{this.message.setText('Could not connect to server');});

        this.socket.on('connect', ()=>{
            this.socket.emit('joinRoom',lobby);
        });

        this.socket.on('roomJoined', ()=>{this.scene.start(CST.SCENES.LOBBY, {lobbyID: lobby});});

        this.socket.on('alreadyInRoom', ()=>{this.message.setText('Someone by that name is already in the lobby');});
        this.socket.on('roomFull', ()=>{this.message.setText('This lobby is full');});
        this.socket.on('roomNotFound', ()=>{this.message.setText('The lobby '+lobby+' could not be found');});
    }
}
