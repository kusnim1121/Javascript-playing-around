import GameLoop from "../myLibrary/GameLoop.js";
import Vector from "../myLibrary/Vector.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = 400;
canvas.height = 500;

window.Vector = Vector;
window.canvas = canvas;
window.g = g;
window.gl = gl;

window.liftForce = 14;
window.gravityForce = 0.7;

let bird;
let pipes = [];

(function setup() {
	gl.start();

	bird = new Bird();

	pipes.push(new Pipe());
	setInterval(() => pipes.push(new Pipe()), 2000);
})();

gl.update = () => {
	// if (gl.frameID % 100 == 0) {
	// pipes.push(new Pipe());
	// }

	for (let i = pipes.length - 1; i >= 0; i--) {
		pipes[i].update();
		pipes[i].checkCollision(bird);
		if (pipes[i].checkOffScreen()) {
			pipes.splice(i, 1);
		}
	}

	bird.update();
};

gl.draw = () => {
	g.setColor("black");
	g.fillRect(0, 0, canvas.width, canvas.height);

	pipes.forEach((pipe) => pipe.draw());

	bird.draw();
};
