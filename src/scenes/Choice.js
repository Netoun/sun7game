class Choice extends Phaser.Scene {
    constructor() {
        super("Choice")
        this.players
        this.arrays = ["sylvain", "clement", "paul", "Nicolas", "jacques"]
        this.arraysPhrase = ["sylvainphrase", "clementphrase", "paul", "Nicolas", "jacques"]
        this.arraysDraw = ["drawSylvain", "drawClement", "drawPaul", "drawNicolas", "drawJacques"]
    }

    preload() {
        this.load.audio('sylvainphrase', [
            'assets/sylvainphrase.mp3'
        ]);
        this.load.audio('clementphrase', [
            'assets/clementphrase.mp3'
        ]);
        this.load.image('sylvain', 'assets/Sylvain.png')
        this.load.image('jacques', 'assets/jacques.png')
        this.load.image('clement', 'assets/Clement.png')
        this.load.image('paul', 'assets/Paul.png')
    }

    create() {
        this.players = this.add.group()
        this.arrays.forEach((element, i) => {
            var spritePlayers = this.add.sprite((i + 1) * 132, 300, element).setInteractive();
            spritePlayers.name = i
            spritePlayers.on('clicked', this.clickHandler, this);
            this.players.create(spritePlayers)
        });

        this.input.on('gameobjectup', (pointer, gameObject) => {
            gameObject.emit('clicked', gameObject, this);
            this.scene.start("Game")
        }, this);
    }

    clickHandler(box) {
        this.sound.play(this.arraysPhrase[box.name])
        choicePlayer = this.arraysDraw[box.name]
    }
}

export default Choice;
