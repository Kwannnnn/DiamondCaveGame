import Phaser from "phaser";
import { CST } from "../utils/CST";

/*
    This scene is run after the team finishes the map. Here the perk for the next map is chosen.
*/
export default class Perks extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PERKS
        })
    }

    init(data) {
        this.perks = data.perksToDisplay;
    }

    preload() {
        
    }

    create () {
        // const speedPerk = this.add.image(400, 250, 'speed-icon');
        // speedPerk.setScale(0.3);
        // speedPerk.setInteractive();
        this.btnPerks = [];
        const style = { font: "36px Arial", fill: "#000"};

        for (let i = 0; i < this.perks.length; i++) {
            const btn = this.add.text(100 + 300 * i + 1, 350, this.perks[i], style).setInteractive();
            btn.on("clicked", () => {console.log("Clicked on " + this.perks[i])}, this)
            this.btnPerks.push(btn);            
        }

        // const speedPerkText = this.add.text(310, 350, 'Speed Perk', style);
        // speedPerkText.on('pointerover', () => {speedPerkText.setTint(0x30839f)});
        // speedPerk.on('clicked', this.applySpeedPerk, this);


        // const timePerk = this.add.image(800, 250, 'clock-icon').setInteractive();
        // timePerk.on("clicked", this.applyTimePerk, this);

        // const timePerkText = this.add.text(710, 350, 'Time Perk', style);
        // timePerkText.on('pointerover', () => {speedPerkText.setTint(0x30839f)});

        this.cameras.main.setBackgroundColor('#fff');

        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);        
    }

    update () {

    }

    applySpeedPerk() {
        console.log("Speed Perk to be added")
    }

    applyTimePerk() {
        console.log("Time perk to be added");
    }
}