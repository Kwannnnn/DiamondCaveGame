import CollectDiamond from "../events/CollectDiamondEvent";

export default class HUD extends Phaser.Scene {
    constructor() {
        super({
            key: "hud"
        });

        this.fullWidth = 200;
        this.x = 100;
        this.y = 40;

        // Initial clock counts
        this.minutes = 0;
        this.seconds = 0;
    }

    init(data) {
        this.world = data.world;
        this.stage = data.stage;

        this.collectedDiamonds = 0;
        this.totalDiamonds = data.totalDiamonds;
    }

    preload() {
        //preloading assets for lifepool
        this.load.image('left-cap', 'assets/barHorizontal_green_left.png')
        this.load.image('middle', 'assets/barHorizontal_green_mid.png')
        this.load.image('right-cap', 'assets/barHorizontal_green_right.png')

        this.load.image('left-cap-shadow', 'assets/barHorizontal_shadow_left.png')
        this.load.image('middle-shadow', 'assets/barHorizontal_shadow_mid.png')
        this.load.image('right-cap-shadow', 'assets/barHorizontal_shadow_right.png')
    }

    create() {
        // background shadow
        const leftShadowCap = this.add.image(this.x, this.y, 'left-cap-shadow')
            .setOrigin(0, 0.5)

        const middleShaddowCap = this.add.image(leftShadowCap.x + leftShadowCap.width, this.y, 'middle-shadow')
            .setOrigin(0, 0.5)

        this.add.image(middleShaddowCap.x + middleShaddowCap.displayWidth, this.y, 'right-cap-shadow')
            .setOrigin(0, 0.5)

        this.leftCap = this.add.image(this.x, this.y, 'left-cap')
            .setOrigin(0, 0.5)

        this.middle = this.add.image(this.leftCap.x + this.leftCap.width, this.y, 'middle')
            .setOrigin(0, 0.5)

        this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, this.y, 'right-cap')
            .setOrigin(0, 0.5)

        this.setMeterPercentage(0.5)

        // Create the world and stage text
        this.gamestage = this.add.text(1000, 25, `World: ${this.world}-${this.stage}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });


        // Create the Diamond counter
        this.diamondCounter = this.add.text(600, 25, `Gems: ${this.collectedDiamonds}/${this.totalDiamonds}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        CollectDiamond.on('update-count', this.updateDiamondCount, this);

        // Create the clock
        this.clock = this.add.text(300, 25, `Time: ${this.seconds}:${this.minutes}`, {
            color: "#FFFFFF",
            fontSize: 40,
        });

        this.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            CollectDiamond.off('update-count', this.updateDiamondCount, this);
        })
    }

    setMeterPercentage(percent = 1)
    {
        const width = this.fullWidth * percent

        this.middle.displayWidth = width
        this.rightCap.x = this.middle.x + this.middle.displayWidth
    }

    setMeterPercentageAnimated(percent = 1, duration = 1000)
    {
        const width = this.fullWidth * percent

        this.tweens.add({
            targets: this.middle,
            displayWidth: width,
            duration,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: () => {
                this.rightCap.x = this.middle.x + this.middle.displayWidth

                this.leftCap.visible = this.middle.displayWidth > 0
                this.middle.visible = this.middle.displayWidth > 0
                this.rightCap.visible = this.middle.displayWidth > 0
            }
        })
    }

    // Update time and clock
    updateClock () {
        this.seconds++;
        if (this.seconds === 60) {
            this.minutes++;
            this.seconds = 0;
        }

        this.clock.setText(`Time: ${this.minutes}:${this.seconds}`);
    }

    updateDiamondCount(count) {
        this.collectedDiamonds = count;

        if (this.collectedDiamonds === this.totalDiamonds) {
            this.diamondCounter.setText(`Go to next map!`);
        } else {
            this.diamondCounter.setText(`Gems: ${this.collectedDiamonds}/${this.totalDiamonds}`);
        }        
    }
}