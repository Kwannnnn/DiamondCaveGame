import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { usernameForm } from '../components/UsernameTextField'

// const usernameForm = '<input type="text" name="username" placeholder="Enter username"/>';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOBBY
        });

        this.playerList = new Map();
    }

    init(data) {
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

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 350, 'Choose a username', {
            color: '#FFFFFF',
            fontSize: 60
        }).setOrigin(0.5);

        this.usernameFormObject = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);

        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lobbyID === undefined ? 'Create Lobby' : 'Start game', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        // connect button
        this.connectButton.on('pointerover', () => {
            this.connectButton.setTint(0x30839f);
        });
        this.connectButton.on('pointerout', () => {
            this.connectButton.clearTint();
        });

        this.connectButton.on('pointerdown', () => { 
            this.connect(); 
        });
         
        if (this.lobbyID !== undefined) {
            this.connectButton.destroy();
            this.displayRoom(this.playerIDs);
            this.enableStartButton();
        }

        this.handleSocketEvents();

        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });

        this.actionButton.on('pointerover', () => {
            this.actionButton.setTint(0x30839f);
        });
        this.actionButton.on('pointerout', () => {
            this.actionButton.clearTint();
        });
    }
    
    connect() {
        this.username = this.usernameFormObject.getChildByName('username').value;
        if (this.username === '') {
            this.message.setText('Please enter a username');
            return;
        }

        this.socket.emit('setUsername', this.username);
        this.createLobby();
    }

    createLobby() {
        this.socket.emit('createRoom');
    }

    leaveLobby() {
        this.socket.emit('leaveRoom', this.lobbyID);
    }

    // Room creation (new room)
    createRoom(args) { 
        this.lobbyID = args.roomId;
        this.playerIDs = args.playerIDs;
        this.connectButton.destroy();
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

    createPlayer(playerId, index) {
        return this.add.text(this.game.renderer.width / 2, this.game.renderer.height - (350 - index * 75), 'Player ' + index + ': ' + playerId, {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5);
    }

    displayPlayer(playerIDs) {
        for (let i = 1; i <= playerIDs.length; i++) {
            const player = this.createPlayer(playerIDs[i - 1], i);
            this.playerList.set(playerIDs[i - 1], player);
        }
    }

    enableStartButton() {
        this.actionButton.on('pointerdown', () => {
            console.log('click');
            this.socket.emit('gameStart', this.lobbyID);
        });
        this.actionButton.on('pointerover', () => {
            this.actionButton.setTint(0x30839f);
        });
        this.actionButton.on('pointerout', () => {
            this.actionButton.clearTint();
        });
    }

    disableStartButton() {
        this.actionButton.off('pointerdown');
        this.actionButton.off('pointerover');
        this.actionButton.off('pointerout');
        this.actionButton.setTint(0x71797E);
    }

    displayStartButton() {
        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, 'Start game', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();
        this.socket.emit('checkGameReady', this.lobbyID);
    }

    handleSocketEvents() {
        this.socket.on('roomCreated', (args) => {
            this.createRoom(args);
        });

        this.socket.on('newPlayerJoined', (playerId) => {
            this.playerList.set(playerId, this.createPlayer(playerId, this.playerList.size + 1));
            this.displayRoom(this.playerIDs);
        }); // re-render the scene if new player joins

        this.socket.on('connect_error', () => {
            this.displayError();
        });

        // enable the start button if all players are ready
        this.socket.on('gameReadyToStart', () => this.enableStartButton());

        // disable the start button if not all players are ready
        this.socket.on('gameNotReadyToStart', () => this.disableStartButton());

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

        this.socket.on('playerLeft', (playerNames) => {
            this.playerIDs = playerNames;
            for (const value of this.playerList.values()) {
                value.destroy();
            }
            this.playerList.clear();
            this.displayRoom(this.playerIDs);
        }); // re-render the scene if a player leaves
    }

    goBack() {
        this.leaveLobby();
        if (this.socket !== undefined) this.socket.removeAllListeners();
        this.scene.start(CST.SCENES.MENU);
    }
}
