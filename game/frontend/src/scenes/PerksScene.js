import Phaser from "phaser";
import { CST } from "../utils/CST";

/*
    This scene is run after the team finishes the map. Here the perk for the next map is chosen.
*/
export default class PerkMenu extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PERKS
        })
    }

    init(data){
        this.perksNames = data.perksNames;
        this.username = data.username;
        this.socket = data.socket;
        this.lobbyID = data.lobbyID;
        
        // this.screenCenterX = this.game.renderer.width /2;
        // this.screenCenterY = this.game.renderer.height /2;
    }

    preload(){
        
    }

    create(){
        // this.background = this.add.rectangle(0,0,10000,10000, "black")

        this.cameras.main.setBackgroundColor("black");
        this.title = this.add.text(100, 100, "Choose a perk", {
            fontSize: 50,
            fontStyle:"bold",
        })
        
        this.timer = 20
        this.countDown = this.add.text(270, 150, this.timer, {
            fontSize: 50,
            fontStyle:"bold",
        })

        setInterval(()=>{
            if(this.timer > 0) {
                this.timer--;
                this.countDown.setText(this.timer) ;
                if(this.timer < 1){
                    console.log("timer hit 0.")
                }
            }
        }, 1000)

        this.perks = []
        for (let i = 0; i < this.perksNames.length; i++) {
            const perkName = this.perksNames[i];
            this.perks.push(this.add.text(
                100, 300+100*i, perkName, 
                {
                fontSize:40
            }).setDepth(1).setInteractive())

            this.perks[i].on('pointerdown', () => {
                this.selectPerk(i);
            })
        }


        this.add.text(900,300,"Teammate Choice:", {fontSize:30})
        this.teammateChoice = this.add.text(900,340,"None",{fontSize:25})
    }

    selectPerk(perkId){
        this.perks.forEach(perk => {
            perk.setColor('white')
        });

        this.socket.emit("chosenPerk", {username: this.username, perkId, lobbyID: this.lobbyID});
        this.perks[perkId].setColor('green')
    }



}