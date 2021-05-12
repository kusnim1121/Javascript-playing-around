import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import Vector from "../myLibrary/Vector.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();
window.gl = gl;

canvas.width = 400;
canvas.height = 400;

let total = 0;
let factor = 0;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

const r = canvas.width / 2 - 16;

(function setup() {
	gl.start();

	addEventListener("keydown", (e) => {
		if (e.key == "ArrowRight") {
			rightPressed = true;
		} else if (e.key == "ArrowLeft") {
			leftPressed = true;
		}
		if (e.key == "ArrowUp") {
			upPressed = true;
		} else if (e.key == "ArrowDown") {
			downPressed = true;
		}
	});

	addEventListener("keyup", (e) => {
		if (e.key == "ArrowRight") {
			rightPressed = false;
		} else if (e.key == "ArrowLeft") {
			leftPressed = false;
		}
		if (e.key == "ArrowUp") {
			upPressed = false;
		} else if (e.key == "ArrowDown") {
			downPressed = false;
		}
	});

	setInterval(() => {
		console.log("total: ", total);
		console.log("factor: ", factor.toFixed(2));
	}, 1500);
})();

function getVector(index) {
	const angle = gl.remap(index, 0, total, 0, Math.PI * 2);
	const v = Vector.fromAngle(angle + Math.PI);
	return v.mult(r);
}

gl.update = function () {
	if (rightPressed) factor += 0.02;
	if (leftPressed) factor -= 0.02;
	if (upPressed) total += 0.5;
	if (downPressed) total -= 0.5;
};

gl.draw = function () {
	g.save();
	g.setColorRGBA(0, 0, 0, 0.5);
	g.fillRect(0, 0, canvas.width, canvas.height);

	g.setColorHSL(factor * 50, 100, 50);
	g.shadowColor(g.getFillColor());
	g.shadowBlur(5);

	g.translate(canvas.width / 2, canvas.height / 2);
	g.circle(0, 0, r);

	for (let i = 0; i < total; i++) {
		const a = getVector(i);
		const b = getVector(i * factor);
		g.line(a.x, a.y, b.x, b.y);
	}
	g.restore();
};
