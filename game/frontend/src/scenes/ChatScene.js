import { CST } from "../utils/CST";
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';

export default class ChatScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.CHAT
        })
    }

    init(data) {
        this.chatMessages = [];
        this.socket = data.socket;

        this.input.keyboard.enabled = true;
    }

    preload() {

    }

    create() {
        this.chatInput = this.add.existing(new InputText(this, 150, 620, 270, 30, {
            id: 'chat',
            type: 'text',
            color: '#000000',
            backgroundColor: '#ffffff', 
            borderColor: '#000000'
        }))
        // TODO: add line wrapping
    
        let chatTextArea = {
            width: 270,
            height: 450
        }
        // chatbox area
        let chatArea = this.make.graphics();
        this.chatBox = this.add.graphics(chatArea);

        this.chatBox.fillStyle(0xdddddd);
        this.chatBox.fillRect(15, 150, chatTextArea.width, chatTextArea.height);

        // create geometry mask to hide pixels
        let mask = new Phaser.Display.Masks.GeometryMask(this, this.chatBox);

        this.chat = this.add.text(15, 150, this.chatMessages, { color: '#26924F', padding: 10, wordWrap: { width: 240 } }).setOrigin(0);

        this.chat.setMask(mask); 

        //  The rectangle they can 'drag' within
        this.chatZone = this.add.zone(15, 150, 270, 450).setOrigin(0).setInteractive();

        this.chatZone.on('pointermove', (pointer) => {

            if (pointer.isDown)
            {
                this.chat.y += (pointer.velocity.y / 10);

                this.chat.y = Phaser.Math.Clamp(this.chat.y, 100, 300);
            }

        });

        // set enter key for sending message
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // send message to server on enter key
        this.enterKey.on('down', event => {
            if (this.chatInput.text != "") {
                this.socket.emit('chatMessage', this.chatInput.text);
                this.chatInput.text = "";
            }
        });

        this.chatInput.on('focus', () => {
            this.input.keyboard.enabled = true;
        })

        // display the messages in chat box
        this.socket.on('chatMessage', (data) => {
            const { sender, message } = data;     
            let chatMessage = sender + ": " + message;
            this.chatMessages.push(chatMessage);
            this.chat.setText(this.chatMessages);
        })
            
    

    }
}   