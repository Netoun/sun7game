class Game extends Phaser.Scene {
    constructor(data) {
        super({
            key: 'Game'
        });
        this.player
        this.platforms
        this.scoreText
        this.stars
        this.bombs
        this.timeCheck = 0
        this.score = 0
        this.choicePlayer = ""
        this.pseudoPlayer = ""
    }

    init(data) {
        this.choicePlayer = data.choicePlayer
        this.pseudoPlayer = data.pseudoPlayer
    }

    preload() {
        this.load.audio('music', [
            '../assets/music/music.mp3'
        ]);
        this.load.audio('saut', [
            'assets/audio/saut.mp3'
        ]);
        this.load.audio('loose', [
            'assets/audio/loose.mp3'
        ]);
        this.load.audio('eat', [
            'assets/audio/eat.mp3'
        ]);
        this.load.audio('dead', [
            'assets/audio/dead.mp3'
        ]);
        this.load.audio('step', [
            'assets/audio/step.mp3'
        ]);
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('restart', 'assets/images/restart.png');
        this.load.image('ground', 'assets/images/platform.png');
        this.load.image('star', 'assets/images/burger.png');
        this.load.image('bomb', 'assets/images/karot.png');
        this.load.spritesheet('drawJacques',
            'assets/images/dude.png',
            { frameWidth: 32, frameHeight: 45 }
        );
        this.load.spritesheet('drawSylvain',
            'assets/images/sylvainDraw.png',
            { frameWidth: 32, frameHeight: 45 }
        );
        this.load.spritesheet('drawClement',
            'assets/images/clementDraw.png',
            { frameWidth: 32, frameHeight: 45 }
        );
        this.load.spritesheet('drawPaul',
            'assets/images/paulDraw.png',
            { frameWidth: 32, frameHeight: 45 }
        );
    }

    create() {
        this.sound.play('music')
        console.log(this.choicePlayer)
        this.add.image(400, 300, 'sky');

        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.createPlatorm()
        this.createPlayer()


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(this.choicePlayer, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: this.choicePlayer, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.choicePlayer, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    createPlatorm() {
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 450, this.choicePlayer);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(200)
    }

    update() {
        if (this.cursors.left.isDown) {

            if (this.time.now - this.timeCheck > 500 && this.player.body.touching.down) {
                this.sound.play('step')
                this.timeCheck = this.time.now
            }

            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            if (this.time.now - this.timeCheck > 500 && this.player.body.touching.down) {
                this.sound.play('step')
                this.timeCheck = this.time.now
            }

            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.sound.play('saut')
            this.player.setVelocityY(-440);
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        this.sound.play('dead')
        this.player.setTint(0xff0000);

        this.player.anims.play('turn');
        this.score = 0

        const sprite = this.add.sprite(400, 300, 'restart').setInteractive();
        this.sound.play('loose')
        sprite.on('pointerup', (pointer) => {
            (async () => {
                const rawResponse = await fetch('https://sun7game-api.herokuapp.com/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: this.pseudoPlayer, score: this.score })
                });
                const content = await rawResponse.json();
            })();
            this.scene.restart({ choicePlayer: this.choicePlayer, pseudoPlayer: this.pseudoPlayer })
        }, this);

    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.sound.play('eat')
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 40) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 10, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;

        }
    }
}

export default Game;
