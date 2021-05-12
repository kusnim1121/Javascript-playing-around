import Graphics from "../../myLibrary/Graphics.js";
import GameLoop from "../../myLibrary/GameLoop.js";
import Vector from "../../myLibrary/Vector.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

window.Vector = Vector;
window.gl = gl;
window.g = g;

canvas.width = 400;
canvas.height = 400;

let objects = [];
let player;
window.objects = objects;

(function setup() {
	gl.start();

	canvas.onmousemove = mouseMove;
	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;

	//build walls
	objects.push(new Rectangle(0, 0, canvas.width, 0));
	objects.push(new Rectangle(0, canvas.height, canvas.width, 0));
	objects.push(new Rectangle(0, 0, 0, canvas.height));
	objects.push(new Rectangle(canvas.width, 0, 0, canvas.height));
	player = new Player(canvas.width / 2, canvas.height / 2);
})();

gl.update = function () {
	objects.forEach((object) => object.update());
	player.update();
	// player.checkDistToObjects(objects);
};

gl.draw = function () {
	g.clearRect(0, 0, canvas.width, canvas.height);
	g.setGlobalAlpha(0.5);

	objects.forEach((object) => object.draw());
	player.draw();

	if (mouseIsDown) {
		g.setColor("red");
		let x = mouse.dx < 0 ? mouse.initialX + mouse.dx : mouse.initialX;
		let y = mouse.dy < 0 ? mouse.initialY + mouse.dy : mouse.initialY;
		let dx = Math.abs(mouse.dx);
		let dy = Math.abs(mouse.dy);
		g.fillRect(x, y, dx, dy);
	}
};

//Mouse Drag Operation
let mouse = {
	initialX: null,
	initialY: null,
	dx: null,
	dy: null,
};
let mouseIsDown = false;

function mouseDown(e) {
	mouse.initialX = e.x;
	mouse.initialY = e.y;
	mouse.dx = 0;
	mouse.dy = 0;
	mouseIsDown = true;
}

function mouseMove(e) {
	//control angle of player & rays
	let dx = e.x - player.pos.x;
	let dy = e.y - player.pos.y;
	player.angle = Math.atan2(dy, dx);

	//keep track of mouse drag motion
	mouse.dx = e.x - mouse.initialX;
	mouse.dy = e.y - mouse.initialY;
}

function mouseUp(e) {
	mouseIsDown = false;

	let dx = Math.abs(mouse.dx);
	let dy = Math.abs(mouse.dy);
	//Mouse Clicked
	if (dx < 10 && dy < 10) {
		objects.push(new Circle(mouse.initialX, mouse.initialY, Math.random() * 50 + 10));
	}
	//Mouse Dragged
	else {
		let x = mouse.dx < 0 ? mouse.initialX + mouse.dx : mouse.initialX;
		let y = mouse.dy < 0 ? mouse.initialY + mouse.dy : mouse.initialY;
		objects.push(new Rectangle(x, y, dx, dy));
	}
}
