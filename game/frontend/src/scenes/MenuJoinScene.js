import Phaser from 'phaser';
import { CST } from "../CST";

let SERVER_URL = "localhost:3000";
const addressForm = '<input type="text" name="address" value="'+SERVER_URL+'" />';

export default class JoinScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.JOIN
        })
    }

    preload() {

    }

    create() {

        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.25, "logo").setDepth(1);
        this.add.image(0,0, "title_bg").setOrigin(0).setDepth(0)

        this.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height - 350, "Disconnected", {
            color: "#FFFFFF",
            fontSize: 60
        }).setOrigin(0.5);

        this.addressInput = this.add.dom(this.game.renderer.width / 2, this.game.renderer.height - 250).createFromHTML(addressForm);

        this.connectButton = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height - 150,"join_button")
            .setInteractive()
            .on('pointerdown', () => {this.connect()})
            .on('pointerover', () => {this.connectButton.setTint(0x30839f)})
            .on('pointerout', () => {this.connectButton.clearTint()})
    }

    connect(){
        let ip = "http://"+this.addressInput.getChildByName("address").value;
        this.message.setText("Connecting to:"+ip);
        SERVER_URL = ip;
        this.socket = io(SERVER_URL, {reconnection: false});

        this.socket.on('connect', ()=>{this.createLobby()});

        this.socket.on('roomCreated', (args)=>{this.displayCode(args)});

        this.socket.on('connect_error', ()=>{this.displayError()});
    }

    createLobby(){
        this.socket.emit('createRoom');
    }

    displayCode(args){
        
        this.message.setText("Lobby code: "+args);
        console.log(args);
    }

    displayError(){
        this.message.setText("Could not connect!");
    }

    sendDisconnect(){
        //TODO: Currently we just spawn infinite live sockets, a disconnect option should be implemented
    }
}
