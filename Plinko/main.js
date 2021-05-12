///<reference path="../myLibrary/Matter.js" />

import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.getElementById("plinko");
const ctx = canvas.getContext("2d");
const gl = new GameLoop();
const g = new Graphics(ctx);

const width = canvas.width;
const height = canvas.height;

const Engine = Matter.Engine;
const Events = Matter.Events;

let engine, world;
let particles = [];
let boundaries = [];
let plinkos = [];

const cols = 10;
const rows = 10;
const spacing = width / cols;

let ding;

(function main() {
	preload();

	engine = Engine.create();
	world = engine.world;
	Engine.run(engine);
	gl.start();

	//make ground
	boundaries.push(new Boundary(world, width / 2, height + 40, width, 100));
	//make plinkos
	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols + 1; i++) {
			let x = i * spacing;
			if (j % 2 == 1) {
				x += spacing / 2;
			}
			let y = j * spacing;
			plinkos.push(new Plinko(world, x, y + height / 5, 5));
		}
	}
	//make buckets
	for (let i = 0; i < cols + 1; i++) {
		boundaries.push(new Boundary(world, i * spacing, height - 40, 10, 80));
	}

	Events.on(engine, "collisionStart", collision);
})();

function collision(event) {
	ding.play();
}
function preload() {
	ding = new Audio();
	ding.src = "./Ding-sound-effect.mp3";
}

gl.update = function () {
	if (gl.frameID % 60 == 0) {
		particles.push(new Particle(world, width / 2, 20, 7));
	}

	//if a particle goes off screen, remove it
	particles.forEach(function (particle, index, particles) {
		if (particle.body.position.y > height + 100) {
			Matter.World.remove(world, particle.body);
			particles.splice(index, 1);
		}
	});
	Engine.update(engine);
};

gl.draw = function () {
	g.setColor("black");
	g.fillRect(0, 0, width, height);
	particles.forEach(function (p) {
		p.draw(g);
	});
	boundaries.forEach(function (b) {
		b.draw(g);
	});
	plinkos.forEach(function (p) {
		p.draw(g);
	});
};
