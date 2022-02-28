import { CST } from "../CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    init() {

    }
    preload() {
        this.load.image("title_bg", "assets/image/title_bg.jpg");
        this.load.image("options_button", "assets/image/option.png");
        this.load.image("play_button", "assets/image/create_room.png");
        this.load.image("join_button", "assets/image/join_room.png")
        this.load.image("logo", "assets/image/logo.png");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xFFFF
            }
        })
        this.load.on("progress", (percent)=> {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            this.add.text(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2 - 100, 'Loading..', 
            { 
                fontFamily: 'Arial', fontSize: 64, color: '#fff'
            });
            console.log(percent)
        })

        this.load.on("complete", () => {
            console.log("done")
        })
    }
    create() {
        this.scene.start(CST.SCENES.MENU)
    }
}