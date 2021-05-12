import Graphics from "../myLibrary/Graphics.js";
import GameLoop from "../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();

window.canvas = canvas;
window.gl = gl;

canvas.width = 640;
canvas.height = 360;

// let circles = [];
window.circles = [];
let image;
let imageData;

(function setup() {
	preLoad();
})();

function preLoad() {
	image = new Image();
	image.onload = () => {
		canvas.width = image.width;
		canvas.height = image.height;
		g.drawImage1(image, 0, 0);
		imageData = g.getImageData(0, 0, image.width, image.height).data;
		gl.start();
	};
	// image.src = "tiger.jpg";
	// image.src = "lion.jpg";
	// image.src = "bird.jpeg";
	// image.src = "monkey.jpg";
	image.src = "deer.jpg";
	// image.src = "dolphin.jpeg";
}

function makeNewCircle() {
	const x = Math.random() * image.width;
	const y = Math.random() * image.height;
	let valid = true;
	for (const c of circles) {
		const dx = x - c.x;
		const dy = y - c.y;
		const distSq = dx * dx + dy * dy;
		if (distSq < c.r * c.r) {
			valid = false;
			break;
		}
	}
	if (valid) {
		const index = (Math.floor(x) + Math.floor(y) * image.width) * 4;
		const r = imageData[index + 0];
		const g = imageData[index + 1];
		const b = imageData[index + 2];
		return new Circle(x, y, `rgb(${r},${g},${b})`);
	} else return null;
}

gl.update = function () {
	if (gl.frameID % 1 == 0) {
		let count = 0;
		let attempt = 0;
		let totalPerFrame = 300;
		while (count < totalPerFrame) {
			let newCircle = makeNewCircle();
			if (newCircle) {
				circles.push(newCircle);
				count++;
			}
			attempt++;
			if (attempt > 1000) {
				gl.pause();
				console.log("FINISHED");
				return;
			}
		}
	}
	circles.forEach((c) => c.update());
};

gl.draw = function () {
	g.clearRect(0, 0, canvas.width, canvas.height);
	// g.drawImage1(image, 0, 0);
	circles.forEach((c) => c.draw(g));
};
