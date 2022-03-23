import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { usernameForm } from '../components/UsernameTextField'

const SERVER_URL = 'localhost:3000'; //TODO: Change to VPS URL
// const usernameForm = '<input type="text" name="username" placeholder="Enter username"/>';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOBBY
        });
    }

    init(data) {
        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });
        /* FIXME: The way the 2nd player display the scene is based on client variables. Should be another way to do that but I haven't figured out. */
        if (data === undefined) return;
        this.lobbyID = data.roomId;
        this.playerIDs = data.playerIDs;
        this.username = data.username;
        this.socket = data.socket;
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0, 0, 'title_bg').setOrigin(0).setDepth(0);
        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();

        this.backButton.on('pointerdown', () => this.goBack());
        this.backButton.on('pointerover', () => {
            this.backButton.setTint(0x30839f);
        });
        this.backButton.on('pointerout', () => {
            this.backButton.clearTint();
        });

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 350, 'Disconnected', {
            color: '#FFFFFF',
            fontSize: 60
        }).setOrigin(0.5);

        this.usernameFormObject = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);

        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lobbyID === undefined ? 'Connect' : 'Start game', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        if (this.lobbyID === undefined) this.actionButton.on('pointerdown', () => {
            this.connect();
        });
        else {
            //TODO: Disable button until both players are connected
            this.actionButton.on('pointerdown', () => this.socket.emit('gameStart', this.lobbyID));
            this.displayRoom(this.playerIDs);
            this.socket.on('initialGameState', (payload) => {
                this.scene.start(CST.SCENES.GAME, {
                    world: 1,
                    stage: 1,
                    socket: this.socket,
                    username: this.username,
                    lobbyID: this.lobbyID,
                    initialGameState: payload
                });
            });
        }
        this.actionButton.on('pointerover', () => {
            this.actionButton.setTint(0x30839f);
        });
        this.actionButton.on('pointerout', () => {
            this.actionButton.clearTint();
        });
    }

    connect() {
        let ip = 'http://' + SERVER_URL;
        this.username = this.usernameFormObject.getChildByName('username').value;
        if (this.username === '') {
            this.message.setText('Please enter a username');
            return;
        }

        this.message.setText('Connecting to:' + ip);
        this.socket = io(SERVER_URL, { query: 'username=' + this.username, reconnection: false });

        this.socket.on('connect', ()=>{
            this.createLobby();
        }); // emit createRoom event to the server

        this.socket.on('roomCreated', (args)=>{
            this.createRoom(args);
        });

        this.socket.on('newPlayerJoined', (playerNames)=>{
            this.playerIDs = playerNames;
            this.displayRoom(this.playerIDs);
        }); // re-render the scene if new player joins

        this.socket.on('connect_error', ()=>{
            this.displayError();
        });

        this.socket.on('initialGameState', (payload) => {
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: 1,   
                socket: this.socket,
                username: this.username,
                lobbyID: this.lobbyID,
                initialGameState: payload
            });
        });
    }

    createLobby() {
        this.socket.emit('createRoom');
    }

    // Room creation (new room)
    createRoom(args) { 
        this.lobbyID = args.roomId;
        this.playerIDs = args.playerIDs;
        console.log(this.playerIDs);
        this.displayRoom(this.playerIDs);
    }

    displayRoom(playerIDs) {
        this.displayCode();
        this.displayPlayer(playerIDs);
        this.usernameFormObject.destroy();
        this.displayStartButton();
    }

    displayError() {
        this.message.setText('Could not connect!');
    }

    displayCode() {
        this.message.setText('Lobby Code: ' + this.lobbyID);
    }

    displayPlayer(playerIDs) {
        for (let i = 1; i <= playerIDs.length; i++) {
            this.add.text(this.game.renderer.width / 2, this.game.renderer.height - (350 - i * 75), 'Player ' + i + ': ' + playerIDs[i - 1], {
                color: '#FFFFFF',
                fontSize: 40
            }).setOrigin(0.5);
        }
    }

    displayStartButton() {
        this.actionButton.setText('Start game');
        this.actionButton.off('pointerdown');
        if (this.playerIDs.length !== 2) {
            this.actionButton.off('pointerover');
            this.actionButton.off('pointerout');
            this.actionButton.setTint(0x71797E);
        } else {
            this.actionButton.clearTint();
            this.actionButton.on('pointerover', () => {
                this.actionButton.setTint(0x30839f);
            });
            this.actionButton.on('pointerout', () => {
                this.actionButton.clearTint();
            });
            this.actionButton.on('pointerdown', () => this.socket.emit('gameStart', this.lobbyID));
        }
    }

    goBack() {
        if (this.socket !== undefined) this.socket.disconnect();
        this.lobbyID = undefined;
        this.playerIDs = [];
        this.scene.start(CST.SCENES.MENU);
    }
}
