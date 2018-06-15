import 'phaser';
import $ from "jquery";
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

$(document).ready(function () {
    (async () => {
        const rawResponse = await fetch('https://sun7game-api.herokuapp.com/score', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        const content = await rawResponse.json();
        const arraySort = content.sort(function (a, b) {
            return b.point - a.point;
        });
        console.log(arraySort)
        const table = document.getElementById("myTable");
        const header = table.createTHead();
        const row_header = header.insertRow(0);
        const cell_header_rank = row_header.insertCell(0);
        const cell_header = row_header.insertCell(1);
        const cell_header2 = row_header.insertCell(2);



        cell_header.innerHTML = "<b>Pseudo</b>";
        cell_header2.innerHTML = "<b>Score</b>";

        content.forEach((element, i) => {
            if (i == 10) {
                return
            }
            const row = table.insertRow(i + 1);
            const rank = row.insertCell(0);
            const pseudo = row.insertCell(1);
            const score = row.insertCell(2);
            rank.innerHTML = i + 1
            pseudo.innerHTML = element.name
            score.innerHTML = element.point
        });
    })();
});

const game = new Phaser.Game(config);