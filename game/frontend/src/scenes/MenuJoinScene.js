import Phaser from 'phaser';
import { CST } from '../utils/CST';
import { usernameForm } from '../components/UsernameTextField'
import { lobbyCodeForm } from '../components/LobbyTextField'

// const lobbyCodeForm = '<label class="custom-field one">\n' +
//     '  <input type="text" name="lobby" placeholder="Enter lobby code"/>';
// const usernameForm = '<input type="text" name="usernameForm" placeholder="Enter username"/>';

export default class JoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.JOIN
        });
    }

    init(data) {
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

        this.lobbyCodeInput = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 300).createFromHTML(lobbyCodeForm);
        this.usernameForm = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(usernameForm);

        this.joinButton = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 150, 'join_button')
            .setInteractive()
            .on('pointerdown', () => {
                this.join();
            })
            .on('pointerover', () => {
                this.joinButton.setTint(0x30839f);
            })
            .on('pointerout', () => {
                this.joinButton.clearTint();
            });

        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });

        this.handleSocketEvents();
    }

    join() {
        let lobby = this.lobbyCodeInput.getChildByName('lobby').value;
        this.username = this.usernameForm.getChildByName('username').value;

        if (lobby === '') {
            this.message.setText('Please enter the lobby code');
            return;
        }

        if (lobby.length != 6) {
            this.message.setText('Incorrect room code');
            return;
        }

        lobby = lobby.toUpperCase();

        if (this.username === '') {
            this.message.setText('Please enter a username');
            return;
        }

        this.message.setText('Connecting to lobby: ' + lobby);

        this.socket.emit('setUsername', this.username);
        this.socket.emit('joinRoom', lobby);
    }
    
    handleSocketEvents() {
        // TODO: Remove this. It is not necessary anymore!
        this.socket.on('connect_error', () => {
            this.message.setText('Could not connect to server');
        });

        this.socket.on('roomJoined', (args) => {
            this.scene.start(CST.SCENES.LOBBY, { roomId: args.roomId, username: this.username, playerIDs: args.playerIDs, socket: this.socket });
        }); // jump to menu scene with data responded from server

        this.socket.on('alreadyInRoom', () => {
            this.message.setText('Someone by that name is already in the lobby');
        });
        this.socket.on('roomFull', () => {
            this.message.setText('This lobby is full');
        });

        this.socket.on('roomNotFound', () => {
            this.message.setText('The lobby ' + lobby + ' could not be found');
        });
        this.socket.on('nameAlreadyExistForAPlayer', ()=>{
            this.message.setText('There is already a player with the username you are trying to use');
        });
        this.socket.on('nameAlreadyExistForASpectator', ()=>{
            this.message.setText('There is already a spectator with the username you are trying to use');
        });
    }

    goBack() {
        if (this.socket !== undefined) this.socket.removeAllListeners();
        this.scene.start(CST.SCENES.MENU);
    }
}
