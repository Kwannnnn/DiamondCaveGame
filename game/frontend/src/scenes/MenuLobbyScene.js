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
        this.playersMap = new Map();  // {id : {username, text}}
        if (data === undefined) return;
        this.lobbyID = data.roomId;
        this.players = data.players;
        this.username = data.username;
        this.socket = data.socket;
    }

    create() {
        this.add.image(this.game.renderer.width / 2, 0, 'title_bg').setOrigin(0.5, 0).setDepth(0);

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

    /**
     * Sets the entries of the players Map with the data from
     * the previous scene, and then deletes the data.players field.
     */
    populatePlayersMap() {
        this.players.forEach(p => {
            this.setPlayerMapEntry(p.id, p.username);
        });
        delete this.players;
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
        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'Choose your username', {
            color: '#FFFFFF',
            fontSize: 88,
            fontFamily: 'Helvetica'
        }).setOrigin(0.5);
        this.message.setShadow(4, 4, 'rgba(0,0,0,0.9)', 5);
    }

    initUsernameForm() {
        this.usernameFormObject = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height / 2 + 2 * 90).createFromHTML(usernameForm);
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

    displayError() {
        this.message.setText('Could not connect!');
    }

    displayCode() {
        this.message.setText('Lobby Code: ' + this.lobbyID);
    }

    /**
     * Sends the chosen username to the server and asks the server
     * to create a new room.
     * @returns if the username is empty 
     */
    createLobby() {
        this.username = this.usernameFormObject.getChildByName('username').value;
        if (this.username === '') {
            this.message.setText('Please enter a username');
            return;
        }

        this.socket.emit('setUsername', this.username);
        this.socket.emit('createRoom');
    }

    /**
     * A helper method that creates a text GameObject to the current scene.
     * @param {string} username the username of the user
     * @param {number} index the index (for enumeration)
     * @returns {Phaser.GameObjects.Text} a Text Game Object
     */
    createPlayer(username, index) {
        return this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + ((1 + index) * 90), 'Player ' + index + ': ' + username, {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5);
    }

    /**
     * Enables the start button, and its listeners.
     */
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

    /**
     * Disables the start button, and removes the listeners associated with
     * the button.
     */
    disableStartButton() {
        this.actionButton.off('pointerdown');
        this.actionButton.off('pointerover');
        this.actionButton.off('pointerout');
        this.actionButton.setTint(0x71797E);
    }

    /**
     * Changes the text of the action button to 'Start game'.
     */
    displayStartButton() {
        this.actionButton.setText('Start game');
    }

    /**
     * Changes the text of the action button to 'Create Lobby' and
     * sets the onClick listener of the button to trigger lobby creation.
     */
    displayCreateLobbyButton() {
        this.actionButton.setText('Create Lobby');

        this.actionButton.on('pointerdown', () => this.createLobby());
    }

    /**
     * Creates a new entry in the playersMap.
     * @param {string} id the id of the new player
     * @param {string} username the username of the new player
     */
    setPlayerMapEntry(id, username) {
        this.playersMap.set(id, {
            username: username,
            text: this.createPlayer(username, this.playersMap.size + 1)
        })
    }

    /**
     * Re-renders the players map.
     */
    rerenderPlayersMap() {
        let index = 0;
        for (const value of this.playersMap.values()) {
            index++;
            value.text.setText('Player ' + index + ': ' + value.username);
            value.text.y = this.game.renderer.height / 2 + ((1 + index) * 90);
        }
    }


    initSocketListeners() {
        this.socket.on('roomCreated', (args) => {
            this.lobbyID = args.roomId;
            args.players.forEach(p => {
                this.setPlayerMapEntry(p.id, p.username);
            });
            
            this.displayCode();
            this.displayStartButton();
            this.disableStartButton();

            this.usernameFormObject.destroy();
        });

        this.socket.on('newPlayerJoined', (player) => {
            this.playersMap.set(player.id, {
                username: player.username,
                text: this.createPlayer(player.username, this.playersMap.size + 1)
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
                initialGameState: payload.initialGameState,
                health: payload.health,
                spectatorsCount: payload.spectatorsCount,
                gemsCollected: payload.gemsCollected,
                time: payload.time
            });
        });

        this.socket.on('playerLeft', (player) => {
            this.playersMap.get(player.id).text.destroy();
            this.playersMap.delete(player.id);
            this.rerenderPlayersMap();

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
