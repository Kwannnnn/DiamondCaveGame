import Phaser from 'phaser';

const SERVER_URL = "http://localhost:3000";
const addressForm = '<input type="text" name="roomCode" />';

export default class TitleScreen extends Phaser.Scene {
    preload() {

    }

    create() {
        // let ip = "http://";
        // this.message.setText("Connecting to:"+ip);
        // SERVER_URL = ip;
        this.socket = io(SERVER_URL, { reconnection: false });

        this.socket.on('connect', () => { console.log("connected to server!"); });
        //TODO: This visual code is just here as a reference. Remove it
        this.addressInput = this.add.dom(640, 360).createFromHTML(addressForm);


        this.message = this.add.text(640, 250, "Disconnected", {
            color: "#FFFFFF",
            fontSize: 60
        }).setOrigin(0.5);

        this.createTeamButton = this.add.text(450, 460, "Create team", { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => { this.createRoom() })
            .on('pointerover', () => { this.createTeamButton.setStyle({ fill: '#ff0' }) })
            .on('pointerout', () => { this.createTeamButton.setStyle({ fill: '#0f0' }) });

        this.joinTeamButton = this.add.text(750, 460, "Join team", { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => { this.joinRoom() })
            .on('pointerover', () => { this.joinTeamButton.setStyle({ fill: '#ff0' }) })
            .on('pointerout', () => { this.joinTeamButton.setStyle({ fill: '#0f0' }) });

        this.startGameButton = this.add.text(600, 560, "Start game", { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => { this.startGame() })
            .on('pointerover', () => { this.joinTeamButton.setStyle({ fill: '#ff0' }) })
            .on('pointerout', () => { this.joinTeamButton.setStyle({ fill: '#0f0' }) });

        this.socket.on('roomCreated', (args) => { this.displayCode(args) });

        this.socket.on('roomJoined', (args) => {
            console.log('joined room' + args);
        });

        this.socket.on('newPlayerJoined', (args) => {
            console.log('Player ' + args + ' joined the room');
        });

        this.socket.on('connect_error', () => { this.displayError() });
    }

    createRoom() {
        this.socket.emit('createRoom');
    }

    joinRoom() {
        let code = this.addressInput.getChildByName('roomCode').value;
        this.socket.emit('joinRoom', code);
    }

    displayCode(args) {

        this.message.setText("Room code: " + args);
        console.log(args);
    }

    displayError() {
        this.message.setText("Could not connect!");
    }

    sendDisconnect() {

    }

    startGame() {
        //TODO: pass important data to game scene (e.g. player data)
        this.scene.start('game', {world: 1, stage: 1})
    }
}
