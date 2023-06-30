import "phaser";

import sunsetUrl from "./assets/sunset.png";
import skipUrl from "./assets/skip.png";

import sylvainphraseUrl from "./assets/sylvainphrase.mp3";
import clementphraseUrl from "./assets/clementphrase.mp3";
import SylvainUrl from "./assets/Sylvain.png";
import jacquesUrl from "./assets/jacques.png";
import ClementUrl from "./assets/Clement.png";
import PaulUrl from "./assets/Paul.png";

import musicUrl from "./assets/music.mp3";
import sautUrl from "./assets/saut.mp3";
import looseUrl from "./assets/loose.mp3";
import eatUrl from "./assets/eat.mp3";
import deadUrl from "./assets/dead.mp3";
import stepUrl from "./assets/step.mp3";

import skyUrl from "./assets/sky.png";
import restartUrl from "./assets/restart.png";
import platformUrl from "./assets/platform.png";
import burgerUrl from "./assets/burger.png";
import karotUrl from "./assets/karot.png";
import dudeUrl from "./assets/dude.png";
import sylvainDrawUrl from "./assets/sylvainDraw.png";
import clementDrawUrl from "./assets/clementDraw.png";
import paulDrawUrl from "./assets/paulDraw.png";

var choicePlayer;

class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
    this.logogroup;
    this.logotween;
    this.tweenintro;
    this.textintro;
  }

  preload() {
    this.load.image("logo", sunsetUrl);
    this.load.image("skip", skipUrl);
  }

  create() {
    const circle = new Phaser.Geom.Circle(400, 300, 260);
    this.logogroup = this.add.group({ key: "logo", frameQuantity: 300 });
    Phaser.Actions.PlaceOnCircle(this.logogroup.getChildren(), circle);
    this.logotween = this.tweens.addCounter({
      from: 60,
      to: 0,
      duration: 1000,
      delay: 1000,
      ease: "Sine.easeInOut",
    });

    const sprite = this.add.sprite(400, 550, "skip").setInteractive();

    this.textintro = this.add.text(100, 280, "Sun7 Production", {
      font: "70px peace_sans",
      fill: "#FFF",
    });
    this.textintro.alpha = 0;

    this.tweenintro = this.tweens.add({
      targets: this.textintro,
      duration: 2000,
      delay: 2500,
      alpha: 1,
      yoyo: true,
      onComplete: this.startGame,
      onCompleteParams: [this],
    });

    sprite.on("pointerup", (pointer) => {
      this.scene.start("Choice");
      this.tweenintro.stop();
      this.logogroup.clear(true);
      this.textintro.destroy();
      sprite.destroy();
    });
  }

  update() {
    Phaser.Actions.RotateAroundDistance(
      this.logogroup.getChildren(),
      { x: 400, y: 300 },
      0.02,
      this.logotween.getValue()
    );
  }

  startGame(t, targets, self) {
    self.scene.start("Choice");
  }
}

class Choice extends Phaser.Scene {
  constructor() {
    super("Choice");
    this.players;
    this.arrays = ["sylvain", "clement", "paul", "Nicolas", "jacques"];
    this.arraysPhrase = [
      "sylvainphrase",
      "clementphrase",
      "paul",
      "Nicolas",
      "jacques",
    ];
    this.arraysDraw = [
      "drawSylvain",
      "drawClement",
      "drawPaul",
      "drawNicolas",
      "drawJacques",
    ];
  }

  preload() {
    this.load.audio("sylvainphrase", [sylvainphraseUrl]);
    this.load.audio("clementphrase", [clementphraseUrl]);
    this.load.image("sylvain", SylvainUrl);
    this.load.image("jacques", jacquesUrl);
    this.load.image("clement", ClementUrl);
    this.load.image("paul", PaulUrl);
  }

  create() {
    this.players = this.add.group();
    this.arrays.forEach((element, i) => {
      var spritePlayers = this.add
        .sprite((i + 1) * 132, 300, element)
        .setInteractive();
      spritePlayers.name = i;
      spritePlayers.on("clicked", this.clickHandler, this);
      this.players.create(spritePlayers);
    });

    this.input.on(
      "gameobjectup",
      (pointer, gameObject) => {
        gameObject.emit("clicked", gameObject, this);
        this.scene.start("Game");
      },
      this
    );
  }

  clickHandler(box) {
    this.sound.play(this.arraysPhrase[box.name]);
    choicePlayer = this.arraysDraw[box.name];
  }
}

class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.player;
    this.platforms;
    this.scoreText;
    this.stars;
    this.bombs;
    this.timeCheck = 0;
    this.score = 0;
  }

  preload() {
    this.load.audio("music", [musicUrl]);
    this.load.audio("saut", [sautUrl]);
    this.load.audio("loose", [looseUrl]);
    this.load.audio("eat", [eatUrl]);
    this.load.audio("dead", [deadUrl]);
    this.load.audio("step", [stepUrl]);
    this.load.image("sky", skyUrl);
    this.load.image("restart", restartUrl);
    this.load.image("ground", platformUrl);
    this.load.image("star", burgerUrl);
    this.load.image("bomb", karotUrl);
    this.load.spritesheet("drawJacques", dudeUrl, {
      frameWidth: 32,
      frameHeight: 45,
    });
    this.load.spritesheet("drawSylvain", sylvainDrawUrl, {
      frameWidth: 32,
      frameHeight: 45,
    });
    this.load.spritesheet("drawClement", clementDrawUrl, {
      frameWidth: 32,
      frameHeight: 45,
    });
    this.load.spritesheet("drawPaul", paulDrawUrl, {
      frameWidth: 32,
      frameHeight: 45,
    });
  }

  create() {
    this.sound.play("music");

    this.add.image(400, 300, "sky");

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    this.createPlatorm();
    this.createPlayer();

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(choicePlayer, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: choicePlayer, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(choicePlayer, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platforms);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  createPlatorm() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, choicePlayer);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(200);
  }

  update() {
    if (this.cursors.left.isDown) {
      if (
        this.time.now - this.timeCheck > 500 &&
        this.player.body.touching.down
      ) {
        this.sound.play("step");
        this.timeCheck = this.time.now;
      }

      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      if (
        this.time.now - this.timeCheck > 500 &&
        this.player.body.touching.down
      ) {
        this.sound.play("step");
        this.timeCheck = this.time.now;
      }

      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.sound.play("saut");
      this.player.setVelocityY(-440);
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.sound.play("dead");
    this.player.setTint(0xff0000);

    this.player.anims.play("turn");
    this.score = 0;

    const sprite = this.add.sprite(400, 300, "restart").setInteractive();
    this.sound.play("loose");
    sprite.on("pointerup", (pointer) => {
      this.scene.restart();
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.sound.play("eat");
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 40
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 10, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }
}

const GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Intro, Choice, Game],
};

export class PhaserGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  (window as any)._game = new PhaserGame(GameConfig);
});
