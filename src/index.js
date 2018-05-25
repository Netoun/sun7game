import 'phaser'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}


const arrays = ["sylvain", "clement", "Paul", "Nicolas", "jacques"]
const arraysDraw = ["drawSylvain", "drawClement", "drawPaul", "drawNicolas", "drawJacques"]
var choicePlayer
var text
var group
var tween
var players
var player
var platforms
var cursors
var stars
var bombs
var intro = true
var tweenintro
var score = 0;
var scoreText;
var gameOver
var scene;
var timeCheck;
const game = new Phaser.Game(config)

function preload() {
    this.load.image('sylvain', 'assets/Sylvain.png')
    this.load.image('jacques', 'assets/jacques.png')
    this.load.image('clement', 'assets/Clement.png')
    this.load.image('logo', 'assets/sunset.png')
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/burger.png');
    this.load.image('bomb', 'assets/karot.png');
    this.load.image('skip', 'assets/skip.png');
    this.load.spritesheet('drawJacques',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 45 }
    );
    this.load.spritesheet('drawSylvain',
        'assets/sylvainDraw.png',
        { frameWidth: 32, frameHeight: 45 }
    );
    this.load.spritesheet('drawClement',
        'assets/clementDraw.png',
        { frameWidth: 32, frameHeight: 45 }
    );
    this.load.audio('saut', [
        'assets/saut.mp3'
    ]);
    this.load.audio('eat', [
        'assets/eat.mp3'
    ]);
    this.load.audio('dead', [
        'assets/dead.mp3'
    ]);
    this.load.audio('step', [
        'assets/step.mp3'
    ]);
    this.load.audio('sautbruit', [
        'assets/sautbruit.mp3'
    ]);
}

function create() {
    const self = this

    players = this.add.group({
        defaultKey: ['cokecan', 'coucou '],
        maxSize: 5
    });

    if (intro == true) {
        const circle = new Phaser.Geom.Circle(400, 300, 260)

        group = this.add.group({ key: 'logo', frameQuantity: 300 })

        Phaser.Actions.PlaceOnCircle(group.getChildren(), circle)
        var sprite = this.add.sprite(400, 550, 'skip').setInteractive();



        tween = this.tweens.addCounter({
            from: 60,
            to: 0,
            duration: 1000,
            delay: 1000,
            ease: 'Sine.easeInOut',
        })

        text = this.add.text(100, 280, 'Sun7 Production', { font: "70px peace_sans", fill: '#FFF' });
        text.alpha = 0

        tweenintro = this.tweens.add({
            targets: text,
            duration: 2000,
            delay: 3000,
            alpha: 1,
            yoyo: true,
            onComplete: selectPlayer,
            onCompleteParams: [this]
        });


        sprite.on('pointerup', function (pointer) {

            selectPlayer('', '', self);
            sprite.destroy()

        });

    } else {

        selectPlayer('', '', self);
    }



}

function update() {

    Phaser.Actions.RotateAroundDistance(group.getChildren(), { x: 400, y: 300 }, 0.02, tween.getValue())

    if (intro != true) {

        if (cursors.left.isDown) {
            if (this.time.now - timeCheck > 500 && player.body.touching.down) {
                this.sound.play('step')
                timeCheck = this.time.now
            }

            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            if (this.time.now - timeCheck > 500 && player.body.touching.down) {
                this.sound.play('step')
                timeCheck = this.time.now
            }

            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            this.sound.play('saut')
            this.sound.play('sautbruit')
            player.setVelocityY(-440);
        }
    }
}

const createPlatorm = (self) => {
    platforms = self.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

const createPlayer = (self, choicePlayer) => {
    timeCheck = self.time.now
    player = self.physics.add.sprite(100, 450, choicePlayer);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(200)
}


function selectPlayer(tween, targets, self) {


    tweenintro.stop()
    group.clear(true)
    text.destroy();


    players = self.add.group()
    arrays.forEach((element, i) => {
        var spritePlayers = self.add.sprite((i + 1) * 132, 300, element).setInteractive();
        spritePlayers.name = i
        spritePlayers.on('clicked', clickHandler, this);
        players.create(spritePlayers)
    });

    self.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.emit('clicked', gameObject, self);
    }, self);
}

function startGame(self, choicePlayer) {


    intro = false;

    self.add.image(400, 300, 'sky');

    scoreText = self.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    createPlatorm(self)
    createPlayer(self, choicePlayer)


    self.anims.create({
        key: 'left',
        frames: self.anims.generateFrameNumbers(choicePlayer, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn',
        frames: [{ key: choicePlayer, frame: 4 }],
        frameRate: 20
    });

    self.anims.create({
        key: 'right',
        frames: self.anims.generateFrameNumbers(choicePlayer, { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });



    self.physics.add.collider(player, platforms);
    cursors = self.input.keyboard.createCursorKeys();

    stars = self.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    self.physics.add.collider(stars, platforms);
    self.physics.add.overlap(player, stars, collectStar, null, self);

    bombs = self.physics.add.group();

    self.physics.add.collider(bombs, platforms);

    self.physics.add.collider(player, bombs, hitBomb, null, self);
}

function collectStar(player, star) {
    star.disableBody(true, true);
    this.sound.play('eat')
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 40) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    this.sound.play('dead')
    player.setTint(0xff0000);

    player.anims.play('turn');
    score = 0

    gameOver = true;
    intro = true;

    this.scene.restart();
}

function clickHandler(box, self) {
    choicePlayer = arraysDraw[box.name]
    startGame(self, choicePlayer)
}
