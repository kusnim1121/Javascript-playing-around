import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import ColorPalette from "../myLibrary/ColorGenerator.js";

const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();
const colorPalette = new ColorPalette();

window.canvas = canvas;
window.gl = gl;

canvas.width = innerWidth;
canvas.height = innerHeight;

const stars = [];
const backgroundStars = [];
// const colors = ["#4d0000", "#0000b3", "#000080", "#1a1aff", "#80e5ff", "#e066ff", "#a300cc", "#7a0099", "#ff99dd", "#ffccee", "#ffffff"];
// const colors = colorPalette.colors3;
const colors = colorPalette.colors3;
const backgroundColors = colorPalette.colors7;

let mouseDown = false;
const defaultAlpha = 0.9;
let globalAlpha = defaultAlpha;

(function setup() {
	gl.start();

	//make background stars
	for (let i = 0; i < 1000; i++) {
		const x = Math.random() * canvas.width - canvas.width / 2;
		const y = Math.random() * canvas.height - canvas.height / 2;
		const z = Math.random() * canvas.width;
		const r = 1;
		const color = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
		const speed = 0;
		backgroundStars.push(new Star(x, y, z, r, color, speed));
	}
	//initialize the stars
	for (let i = 0; i < 1500; i++) {
		const x = Math.random() * canvas.width - canvas.width / 2;
		const y = Math.random() * canvas.height - canvas.height / 2;
		const z = Math.random() * canvas.width;
		// const r = Math.random() * 5;
		const r = 3;
		const color = colors[Math.floor(Math.random() * colors.length)];
		const speed = Math.random() * 3;
		stars.push(new Star(x, y, z, r, color, speed));
	}

	gl.enableFullScreen(canvas, "Enter");
	gl.detectResize(canvas);
	canvas.onmousedown = () => (mouseDown = true);
	canvas.onmouseup = () => (mouseDown = false);
})();

gl.update = function () {
	stars.forEach((star) => star.update());
	backgroundStars.forEach((star) => star.update());
};

gl.draw = function () {
	g.setColorRGBA(10, 10, 10, globalAlpha);
	g.fillRect(0, 0, canvas.width, canvas.height);

	g.save();
	g.translate(canvas.width / 2, canvas.height / 2);
	stars.forEach((star) => {
		star.draw(g);
	});
	backgroundStars.forEach((star) => {
		star.draw(g);
	});
	g.restore();

	//alter alpha and rotation speed
	if (mouseDown && globalAlpha > 0.1) {
		globalAlpha -= 0.008;
		stars.forEach((star) => star.makeFaster());
	} else if (!mouseDown && globalAlpha < defaultAlpha) {
		globalAlpha += 0.001;
		if (globalAlpha > defaultAlpha) globalAlpha = defaultAlpha;
		stars.forEach((star) => star.makeSlower());
	}
};
