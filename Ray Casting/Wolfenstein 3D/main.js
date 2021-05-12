import Graphics from "../../myLibrary/Graphics.js";
import GameLoop from "../../myLibrary/GameLoop.js";
import Vector from "../../myLibrary/Vector.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

window.Vector = Vector;
window.gl = gl;
window.g = g;
window.canvas = canvas;

canvas.width = 800;
canvas.height = 400;

const row = 10;
const col = 10;
const boxLength = canvas.height / row;

const mapInfo = {
	numOfRays: 60,
	row: row,
	col: col,
	boxLength: boxLength,
	//prettier-ignore
	map : [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
};
window.mapInfo = mapInfo;

let player;

(function setup() {
	gl.start();
	player = new Player(canvas.width / 4, canvas.height / 2);
})();

function drawMap2D() {
	g.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < col; i++) {
		for (let j = 0; j < row; j++) {
			let val = mapInfo.map[i + j * col];
			if (val == "0") {
				g.setColor("black");
			} else if (val == "1") {
				g.setColor("white");
			}

			g.fillSquare(i * boxLength, j * boxLength, boxLength);
			g.setColor("black");
			g.square(i * boxLength, j * boxLength, boxLength);
		}
	}
}

gl.update = function () {
	player.update();
};

gl.draw = function () {
	drawMap2D();
	player.draw();
};
