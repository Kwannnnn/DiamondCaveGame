import Phaser from 'phaser';
import { io } from 'socket.io-client';

let SERVER_URL = "localhost:3000";
const addressForm = '<input type="text" name="address" value="'+SERVER_URL+'" />';

export default class TitleScreen extends Phaser.Scene {
    preload() {

    }

    create() {

        //TODO: This visual code is just here as a reference. Remove it
        this.addressInput = this.add.dom(640, 360).createFromHTML(addressForm);

        this.message = this.add.text(640, 250, "Disconnected", {
            color: "#FFFFFF",
            fontSize: 60
        }).setOrigin(0.5);

        this.connectButton = this.add.text(620,460,"Connect", {fill: '#0f0'})
            .setInteractive()
            .on('pointerdown', () => {this.connect()})
            .on('pointerover', () => {this.connectButton.setStyle({ fill: '#ff0'})} )
            .on('pointerout', () => {this.connectButton.setStyle({ fill: '#0f0' })} );
    }

    connect(){
        let ip = "http://"+this.addressInput.getChildByName("address").value;
        this.message.setText("Connecting to:"+ip);
        SERVER_URL = ip;
        this.socket = io(SERVER_URL, {reconnection: false});

        this.socket.on('connect', ()=>{this.createLobby()});

        this.socket.on('new lobby event', (args)=>{this.displayCode(args)});

        this.socket.on('connect_error', ()=>{this.displayError()});
    }

    createLobby(){
        this.socket.emit('create team');
    }

    displayCode(args){
        this.message.setText("Lobby code: "+args);
        //FIXME: Underscores render as a space. Might be a Phaser issue, maybe don't use underscores as a code
        console.log(args);
    }

    displayError(){
        this.message.setText("Could not connect!");
    }

    sendDisconnect(){

    }
}
