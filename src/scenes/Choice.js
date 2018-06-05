class Choice extends Phaser.Scene {
    constructor() {
        super({
            key: 'Choice'
        });
        this.players
        this.arrays = ["sylvain", "clement", "paul", "Nicolas", "jacques"]
        this.arraysPhrase = ["sylvainphrase", "clementphrase", "paul", "Nicolas", "jacques"]
        this.arraysDraw = ["drawSylvain", "drawClement", "drawPaul", "drawNicolas", "drawJacques"]
    }

    preload() {
        this.load.audio('sylvainphrase', [
            'assets/audio/sylvainphrase.mp3'
        ]);
        this.load.audio('clementphrase', [
            'assets/audio/clementphrase.mp3'
        ]);
        this.load.image('sylvain', 'assets/images/Sylvain.png')
        this.load.image('jacques', 'assets/images/jacques.png')
        this.load.image('clement', 'assets/images/Clement.png')
        this.load.image('paul', 'assets/images/Paul.png')
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
            this.scene.start("Game", { choicePlayer: this.choicePlayer })
        }, this);
    }

    clickHandler(box) {
        this.scene.remove('game')
        this.sound.play(this.arraysPhrase[box.name])
        this.choicePlayer = this.arraysDraw[box.name]
    }
}

export default Choice;
