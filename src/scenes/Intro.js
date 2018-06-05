class Intro extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'Intro'
        });
        this.logogroup
        this.logotween
        this.tweenintro
        this.textintro
    }
    preload() {
        this.load.image('logo', 'assets/images/sunset.png')
        this.load.image('skip', 'assets/images/skip.png');
    }

    create() {
        const circle = new Phaser.Geom.Circle(400, 300, 260)
        this.logogroup = this.add.group({ key: 'logo', frameQuantity: 300 })
        Phaser.Actions.PlaceOnCircle(this.logogroup.getChildren(), circle)
        this.logotween = this.tweens.addCounter({
            from: 60,
            to: 0,
            duration: 1000,
            delay: 1000,
            ease: 'Sine.easeInOut',
        })

        const sprite = this.add.sprite(400, 550, 'skip').setInteractive();

        this.textintro = this.add.text(100, 280, 'Sun7 Production', { font: "70px peace_sans", fill: '#fff' });
        this.textintro.alpha = 0

        this.tweenintro = this.tweens.add({
            targets: this.textintro,
            duration: 2000,
            delay: 2500,
            alpha: 1,
            yoyo: true,
            onComplete: this.startGame,
            onCompleteParams: [this]
        });

        sprite.on('pointerup', (pointer) => {
            this.scene.start("Choice")
            this.tweenintro.stop()
            this.logogroup.clear(true)
            this.textintro.destroy();
            sprite.destroy()
        });
    }

    update() {
        Phaser.Actions.RotateAroundDistance(this.logogroup.getChildren(), { x: 400, y: 300 }, 0.02, this.logotween.getValue())
    }

    startGame(t, targets, self) {
        self.scene.start("Choice")
    }
}

export default Intro;
