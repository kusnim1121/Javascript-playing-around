import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = innerWidth;
canvas.height = innerHeight;

//the point where the pendulum is stuck to
const cX = canvas.width / 2;
// const cY = 100;

// const r1 = canvas.height / 2 - 60;
// const r2 = canvas.height / 2 - 60;
// const m1 = 25;
// const m2 = 25;

const cY = canvas.height / 2 - 20;

const r1 = canvas.height / 4 + 5;
const r2 = canvas.height / 4 - 20;
const m1 = 15;
const m2 = 15;

let a1 = Math.PI / 2;
let a2 = Math.PI / 2;
let a1_v = 0;
let a2_v = 0;

const gravity = 1;

let hue = 0;

const history = [];

(function setup() {
	gl.start();
	gl.enableFullScreen(canvas, "Enter");
})();

gl.update = function () {
	let num1 = -gravity * (2 * m1 + m2) * Math.sin(a1);
	let num2 = -m2 * gravity * Math.sin(a1 - 2 * a2);
	let num3 = -2 * Math.sin(a1 - a2) * m2;
	let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
	let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
	let a1_a = (num1 + num2 + num3 * num4) / den;

	num1 = 2 * Math.sin(a1 - a2);
	num2 = a1_v * a1_v * r1 * (m1 + m2);
	num3 = gravity * (m1 + m2) * Math.cos(a1);
	num4 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
	den = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
	let a2_a = (num1 * (num2 + num3 + num4)) / den;

	a1_v += a1_a;
	a2_v += a2_a;
	a1 += a1_v;
	a2 += a2_v;
};

gl.draw = function () {
	g.clearRect(0, 0, canvas.width, canvas.height);
	g.save();
	g.translate(cX, cY);

	//draws the path
	if (gl.frameID > 1) {
		// g.setColor("Red");
		g.setColorHSL(hue, 100, 50);
		g.shadowColor("Red");
		g.shadowBlur(5);
		g.strokeWeight(1.5);
		g.beginShape(history[0].x2, history[0].y2);
		for (let i = 1; i < history.length; i++) {
			g.vertex(history[i].x2, history[i].y2);
		}
		g.endShape(false, false);
		hue++;
	}

	//draws the pendulum
	const x1 = r1 * Math.sin(a1);
	const y1 = r1 * Math.cos(a1);
	const x2 = x1 + r2 * Math.sin(a2);
	const y2 = y1 + r2 * Math.cos(a2);
	g.shadowColor("rgba(0,0,0,0)");
	g.setColor("Gray");
	g.line(0, 0, x1, y1);
	g.line(x1, y1, x2, y2);
	g.fillCircle(x1, y1, m1);
	g.fillCircle(x2, y2, m2);
	g.restore();

	history.push({ x2, y2 });
};
