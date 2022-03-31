import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { usernameForm } from '../components/UsernameTextField';
import { Header } from '../components';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOBBY
        });
    }

    init(data) {
        this.playerList = new Map();
        if (data === undefined) return;
        this.lobbyID = data.roomId;
        this.players = data.players;
        this.username = data.username;
        this.socket = data.socket;
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, 'logo').setDepth(1);
        this.add.image(0, 0, 'title_bg').setOrigin(0).setDepth(0);

        this.initBackButton();
        this.initHeader();
        this.initUsernameForm();
        this.initActionButton();
        this.initSocketListeners();

        this.displayCreateLobbyButton();
         
        // If the lobby has been already created - update
        // views to display the lobby
        if (this.lobbyID !== undefined) {
            // Set-up necessary components
            this.displayCode();
            this.populatePlayersMap();
            this.displayStartButton();
            this.enableStartButton();

            // Clean-up unnecessary components
            this.usernameFormObject.destroy();
        }

        this.events.on('shutdown', () => {
            if (this.socket !== undefined) {
                this.socket.removeAllListeners();
            }
        });
    }

    populatePlayersMap() {
        this.players.forEach(p => {
            this.displayPlayer(p.id, p.username);
        });
    }

    initBackButton() {
        this.backButton = this.add.sprite(50, 50, 'back').setDepth(1).setScale(2).setInteractive();

        this.backButton.on('pointerdown', () => this.goBack());

        this.backButton.on('pointerover', () => {
            this.backButton.setTint(0x30839f);
        });

        this.backButton.on('pointerout', () => {
            this.backButton.clearTint();
        });
    }

    initHeader() {
        this.message = new Header(this, this.game.renderer.width / 2, this.game.renderer.height / 2, 'Choose your username');
    }

    initUsernameForm() {
        this.usernameFormObject = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);
    }

    initActionButton() {
        this.actionButton = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 100, '', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        // create lobby button behavior
        this.actionButton.on('pointerover', () => {
            this.actionButton.setTint(0x30839f);
        });

        this.actionButton.on('pointerout', () => {
            this.actionButton.clearTint();
        });
    }

    // displayRoom(players) {
    //     this.displayCode();
    //     for (let [index, p] of this.players.entries()) {
    //         const player = this.createPlayer(p.username, index + 1);
    //         this.playerList.set(p.id, player);
    //     }
    // }

    displayError() {
        this.message.setText('Could not connect!');
    }

    displayCode() {
        this.message.setText('Lobby Code: ' + this.lobbyID);
    }

    createLobby() {
        this.username = this.usernameFormObject.getChildByName('username').value;
        if (this.username === '') {
            this.message.setText('Please enter a username');
            return;
        }

        this.socket.emit('setUsername', this.username);
        this.socket.emit('createRoom');
    }

    createPlayer(username, index) {
        return this.add.text(this.game.renderer.width / 2, this.game.renderer.height - (350 - index * 75), 'Player ' + index + ': ' + username, {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5);
    }

    enableStartButton() {
        this.actionButton.clearTint();
        this.actionButton.off('pointerdown');

        this.actionButton.on('pointerdown', () => {
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
        this.actionButton.setText('Start game');
    }

    displayCreateLobbyButton() {
        this.actionButton.setText('Create Lobby');

        this.actionButton.on('pointerdown', () => this.createLobby());
    }

    displayPlayer(id, username) {
        this.playerList.set(id, {
            username: username,
            text: this.createPlayer(username, this.playerList.size + 1)
        })
    }

    initSocketListeners() {
        this.socket.on('roomCreated', (args) => {
            console.log( args );
            this.lobbyID = args.roomId;
            args.players.forEach(p => {
                this.displayPlayer(p.id, p.username);
            });
            
            this.displayCode();
            this.displayStartButton();
            this.disableStartButton();

            this.usernameFormObject.destroy();
        });

        this.socket.on('newPlayerJoined', (player) => {
            this.playerList.set(player.id, {
                username: player.username,
                text: this.createPlayer(player.username, this.playerList.size + 1)
            });
            // this.displayRoom(this.players);
        }); // re-render the scene if new player joins

        this.socket.on('gameReadyToStart', () => {
            this.displayStartButton();
            this.enableStartButton();
        });// enable the start button if all players are ready

        
        this.socket.on('gameNotReadyToStart', () => {
            this.disableStartButton();
        }); // disable the start button if not all players are ready

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

        this.socket.on('playerLeft', (player) => {
            this.playerList.get(player.id).text.destroy();
            this.playerList.delete(player.id);
            let index = 0;
            for (const value of this.playerList.values()) {
                index++;
                value.text.setText('Player ' + index + ': ' + value.username);
                value.text.y = this.game.renderer.height - (350 - index * 75);
            }

            this.disableStartButton();
        }); // re-render the scene if a player leaves
    }

    goBack() {
        this.socket.emit('leaveRoom', this.lobbyID);
        if (this.socket !== undefined) this.socket.removeAllListeners();
        this.scene.stop();
        this.scene.run(CST.SCENES.MENU);
    }
}
