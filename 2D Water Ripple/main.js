import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();

// canvas.width = innerWidth;
// canvas.height = innerHeight;

canvas.width = 300;
canvas.height = 300;

const col = canvas.width;
const row = canvas.height;

let prev;
let curr;
const dampening = 0.96;

(function setup() {
	gl.start();
	// gl.enableFullScreen(canvas, "Enter");
	// gl.detectResize(canvas);

	//make 2D arrays & initialize to 0
	curr = new Array(col).fill(0).map(() => new Array(row).fill(0));
	prev = new Array(col).fill(0).map(() => new Array(row).fill(0));

	addEventListener("mousemove", mouseDragged);
	addEventListener("mousedown", mousePressed);
	// window.devicePixelRatio = 1;
})();

function mouseDragged(e) {
	if (e.x > 1 && e.x < canvas.width - 1) {
		if (e.y > 1 && e.y < canvas.height - 1) {
			curr[e.x][e.y] = 255;
			curr[e.x][e.y - 1] = 255;
			curr[e.x][e.y + 1] = 255;
			curr[e.x - 1][e.y] = 255;
			curr[e.x - 1][e.y - 1] = 255;
			curr[e.x - 1][e.y + 1] = 255;
			curr[e.x + 1][e.y] = 255;
			curr[e.x + 1][e.y - 1] = 255;
			curr[e.x + 1][e.y + 1] = 255;
		}
	}
}

function mousePressed(e) {
	curr[e.x][e.y] = 255;
	curr[e.x][e.y - 1] = 255;
	curr[e.x][e.y + 1] = 255;
	curr[e.x - 1][e.y] = 255;
	curr[e.x - 1][e.y - 1] = 255;
	curr[e.x - 1][e.y + 1] = 255;
	curr[e.x + 1][e.y] = 255;
	curr[e.x + 1][e.y - 1] = 255;
	curr[e.x + 1][e.y + 1] = 255;
}

gl.update = function () {};

gl.draw = function () {
	g.setColor("black");
	g.fillRect(0, 0, canvas.width, canvas.height);

	const canvasData = g.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = canvasData.data;
	for (let i = 1; i < col - 1; i++) {
		for (let j = 1; j < row - 1; j++) {
			curr[i][j] =
				(prev[i - 1][j] + prev[i + 1][j] + prev[i][j - 1] + prev[i][j + 1]) /
					2 -
				curr[i][j];
			curr[i][j] *= dampening;

			const index = (i + j * row) * 4;
			pixels[index + 0] = curr[i][j];
			pixels[index + 1] = curr[i][j];
			pixels[index + 2] = curr[i][j];
		}
	}
	g.putImageData1(canvasData, 0, 0);

	const temp = curr;
	curr = prev;
	prev = temp;
};
