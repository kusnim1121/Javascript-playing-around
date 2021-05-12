import GameLoop from "../../myLibrary/GameLoop.js";
import Graphics from "../../myLibrary/Graphics.js";
import Vector from "../../myLibrary/Vector.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = innerWidth;
canvas.height = innerHeight;

window.Vector = Vector;
window.gl = gl;
window.canvas = canvas;

const flock = [];

(function setup() {
	gl.start();

	for (let i = 0; i < 50; i++) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		flock.push(new Boid(x, y));
	}
})();

gl.update = function () {
	flock.forEach((boid, index, boids) => boid.update(boids));
};

gl.draw = function () {
	g.setColor("DimGrey");
	g.fillRect(0, 0, canvas.width, canvas.height);

	flock.forEach((boid) => boid.draw(g));
};
