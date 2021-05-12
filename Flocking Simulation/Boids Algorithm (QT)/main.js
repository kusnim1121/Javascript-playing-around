import GameLoop from "../../myLibrary/GameLoop.js";
import Graphics from "../../myLibrary/Graphics.js";
import Vector from "../../myLibrary/Vector.js";
import * as QT from "../../myLibrary/Quadtree.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = innerWidth;
canvas.height = innerHeight;

window.Vector = Vector;
window.gl = gl;
window.canvas = canvas;

const flock = [];
let qtree;

(function setup() {
	gl.start();

	for (let i = 0; i < 100; i++) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		flock.push(new Boid(x, y));
	}
	let capacity = 6;
	let bound = new QT.Rectangle(0, 0, canvas.width, canvas.height);
	qtree = new QT.Quadtree(bound, capacity);
})();

gl.update = function () {
	qtree.clear();
	flock.forEach((boid) => {
		qtree.insert(new QT.Point(boid.pos.x, boid.pos.y, boid));
	});

	flock.forEach((boid) => {
		let range = new QT.Circle(boid.pos.x, boid.pos.y, boid.maxPerceptionRadius);
		let points = qtree.query(range);

		let boidsWithin = points.map((a) => a.userData);
		boid.update(boidsWithin);
	});
};

gl.draw = function () {
	g.setColor("DimGrey");
	g.fillRect(0, 0, canvas.width, canvas.height);

	flock.forEach((boid) => boid.draw(g));
};
