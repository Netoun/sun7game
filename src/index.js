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

var group
var tween
var player
var platforms
var cursors
var stars
var intro = true

const game = new Phaser.Game(config)

function preload() {
    this.load.image('logo', 'assets/sunset.png')
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/burger.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    const circle = new Phaser.Geom.Circle(400, 300, 260)

    group = this.add.group({ key: 'logo', frameQuantity: 300 })

    Phaser.Actions.PlaceOnCircle(group.getChildren(), circle)

    tween = this.tweens.addCounter({
        from: 60,
        to: 0,
        duration: 1000,
        delay: 1000,
        ease: 'Sine.easeInOut',
    })

    const text = this.add.text(100, 280, 'Sun7 Production', { font: "70px peace_sans", fill: '#FFF' });
    text.alpha = 0

    this.tweens.add({
        targets: text,
        duration: 2000,
        delay: 3000,
        alpha: 1,
        yoyo: true,
        onComplete: startGame,
        onCompleteParams: [this, text]
    });

}

function update() {
    Phaser.Actions.RotateAroundDistance(group.getChildren(), { x: 400, y: 300 }, 0.02, tween.getValue())

    if (intro != true) {

        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-400);
        }
    }
}

function startGame(tween, targets, self, text) {
    intro = false;
    group.clear(true)
    text.destroy();
    self.add.image(400, 300, 'sky');
    platforms = self.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = self.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    self.anims.create({
        key: 'left',
        frames: self.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    self.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    self.anims.create({
        key: 'right',
        frames: self.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    player.body.setGravityY(200)

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
    self.physics.add.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
    star.disableBody(true, true);
}