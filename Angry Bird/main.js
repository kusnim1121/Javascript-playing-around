///<reference path = "../myLibrary/Matter.d.ts"/>
import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.getElementById("angryBirdCanvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();

const width = canvas.width;
const height = canvas.height;

const { Engine, Event, Mouse, MouseConstraint, World } = Matter;

let engine, world, mConstraint, mouse;
let ground, bird, slingShot;
const boxes = [];

(function setup() {
	gl.start();

	//add event listener
	addEventListener("mouseup", mouseReleased);
	addEventListener("keydown", keyPressed);

	//set up physics engine
	engine = Engine.create();
	world = engine.world;
	mouse = Mouse.create(canvas);
	let options = {
		mouse: mouse,
	};
	mConstraint = MouseConstraint.create(engine, options);
	World.add(world, mConstraint);

	//make ground
	ground = new Ground(world, width / 2, height - 10, width, 20);
	//make boxes
	for (let i = 0; i < 3; i++) {
		boxes.push(new Box(world, 400, height - (i + 1) * 100, 50, 100));
	}
	//make bird
	bird = new Bird(world, 150, 100, 15);
	//make sling shot
	slingShot = new SlingShot(world, 150, 300, bird.body);
})();

function mouseReleased() {
	setTimeout(() => {
		slingShot.fly();
	}, 30);
}

function keyPressed(event) {
	if (event.key == " ") {
		World.remove(world, bird.body);
		bird = new Bird(world, 150, 100, 15);
		slingShot.attach(bird.body);
	}
}

gl.update = function () {
	Engine.update(engine);
};

gl.draw = function () {
	g.setColor("black");
	g.fillRect(0, 0, width, height);

	slingShot.draw(g);
	ground.draw(g);
	bird.draw(g);
	boxes.forEach(function (box) {
		box.draw(g);
	});
};
