import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import * as QT from "../myLibrary/Quadtree.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

window.gl = gl;
window.g = g;

canvas.width = innerWidth;
canvas.height = innerHeight;

const capacity = 6;
let qtree, bound;
let particles = [];
const r = 5;

(function setup() {
	gl.start();
	bound = new QT.Rectangle(0, 0, canvas.width, canvas.height);
	qtree = new QT.Quadtree(bound, capacity);

	for (let i = 0; i < 3000; i++) {
		particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, r));
	}
})();

gl.update = function () {};

gl.draw = function () {
	qtree.clear();

	// qtree = new Quadtree(bound, capacity);
	g.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach((p) => {
		p.move();
		p.draw();
		p.touching = false;

		//reference this particle as the 3rd parameter
		qtree.insert(new QT.Point(p.x, p.y, p));
	});

	for (let p of particles) {
		let range = new QT.Circle(p.x, p.y, p.r * 2);
		let otherPoints = [];
		qtree.query(range, otherPoints);
		for (let otherPoint of otherPoints) {
			//Because other point is not the actual particle, you need to reference it
			let otherParticle = otherPoint.userData;
			// for (let otherParticle of particles) {
			if (p != otherParticle && p.checkTouching(otherParticle)) {
				p.touching = true;
			}
		}
	}
};
