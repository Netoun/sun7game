import 'phaser';
import Intro from './scenes/Intro';
import Choice from './scenes/Choice';
import Game from './scenes/Game';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Intro, Choice, Game]
};

const game = new Phaser.Game(config);