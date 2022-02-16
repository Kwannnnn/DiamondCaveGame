import Phaser from 'phaser';
import { io } from 'socket.io-client';

const SERVER_URL = "http://localhost:3000";

export default class TitleScreen extends Phaser.Scene {
    preload() {

    }

    create() {
        const text = this.add.text(400,250, 'Hello world');
        text.setOrigin(0.5, 0.5);
        
        // TODO: the SERVER_URL constant will be removed at a later stage
        // whenever we actually serve the index.html to the client
        // then the server URL will be deduced from the window.location object.
        // this.socket = io();
        this.socket = io(SERVER_URL);

        this.socket.on('connect', function () {
            console.log('Connected to the server!');
        });

        this.socket.on('disconnect', function () {
            console.log('Handle disconnected from the server!');
        });
    }
}
