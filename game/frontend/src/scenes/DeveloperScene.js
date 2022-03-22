import Phaser from 'phaser';
import { CST } from '../utils/CST';

// input forms for map and username
const mapIdForm = '<input type="text" name="mapIdForm" placeholder="Enter map id"/>';
const usernameForm = '<input type="text" name="usernameForm" placeholder="Enter username"/>';

const SERVER_URL = 'localhost:3000'; //TODO: Change to VPS URL

export default class DeveloperScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.DEV
        });
    }

    init(data) {
        this.events.on('shutdown', () => {
            if (this.socket !== undefined) this.socket.removeAllListeners();
        });
        if (data === undefined) return;
        this.playerIDs = data.playerIDs;
        this.socket = data.socket;
    }

    create() {
        this.message = this.add.text(100, 50, 'Enter room id', {
            color: '#FFFFFF',
            fontSize: 40,
        });

        this.mapIdForm = this.add.dom(200, 100).createFromHTML(mapIdForm);
        this.usernameForm = this.add.dom(200, 125).createFromHTML(usernameForm);

        // start button
        this.button = this.add.text(200, 150, 'start', {
            color: '#FFFFFF',
            fontSize: 40
        }).setOrigin(0.5).setInteractive();

        // start button interaction
        this.button.on('pointerover', () => this.button.setTint(0x30839f));
        this.button.on('pointerout', () => this.button.clearTint());
        this.button.on('pointerdown', () => {
            // store variables from forms
            this.mapId = this.mapIdForm.getChildByName('mapIdForm').value;
            this.username = this.usernameForm.getChildByName('usernameForm').value;

            console.log(`dev ${this.username} wants to go to map ${this.mapId}`);

            // set the socket to listen for messages on
            this.socket = io(SERVER_URL, { query: 'username=' + this.username, reconnection: false });

            // send message with data to server
            this.socket.emit('developerSpawn', {
                mapId: this.mapId,
                username: this.username,
            });
        });

        // patiently listen for response
        this.socket.on('developerGamestate', (payload) => {
            this.scene.start(CST.SCENES.GAME, {
                world: 1,
                stage: 1,
                socket: this.socket,
                username: this.username,
                initialGameState: payload,
            });
        });
    }
}
