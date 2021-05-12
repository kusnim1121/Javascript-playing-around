import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";

const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();

canvas.width = innerWidth;
canvas.height = innerHeight;

const particles = [];
const colors = [
	"#4d0000",
	"#0000b3",
	"#000080",
	"#1a1aff",
	"#80e5ff",
	"#e066ff",
	"#a300cc",
	"#7a0099",
	"#ff99dd",
	"#ffccee",
	"#ffffff",
];

let radians = 0;
let mouseDown = false;
let isFullScreen = false;
const defaultAlpha = 0.9;
let globalAlpha = defaultAlpha;
let rotationSpeed = 0.0015;

(function setup() {
	gl.start();

	//add event listeners
	addEventListener("mousedown", () => (mouseDown = true));
	addEventListener("mouseup", () => (mouseDown = false));
	addEventListener("resize", () => {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
	});

	addEventListener("keydown", keyDown);

	//initialize the stars
	for (let i = 0; i < 1000; i++) {
		// const fakeWidth = canvas.width * 12;
		// const fakeHeight = canvas.height * 12;
		const fakeWidth = canvas.height * 4;
		const fakeHeight = canvas.height * 4;

		const x = Math.random() * fakeWidth - fakeWidth / 2;
		const y = Math.random() * fakeHeight - fakeHeight / 2;
		const r = Math.random() * 1.5;
		const color = colors[Math.floor(Math.random() * colors.length)];

		particles.push(new Particle(x, y, r, color));
	}
})();

function keyDown(e) {
	if (!isFullScreen && e.key == "Enter") {
		canvas.requestFullscreen();
		isFullScreen = true;
	} else if (isFullScreen && e.key == "Enter") {
		document.exitFullscreen();
		isFullScreen = false;
	}
}

gl.draw = function () {
	g.setColorRGBA(10, 10, 10, globalAlpha);
	g.fillRect(0, 0, canvas.width, canvas.height);

	g.save();
	g.translate(canvas.width / 2, canvas.height / 2);
	g.rotate(radians);
	particles.forEach((particle) => {
		particle.draw(g);
	});
	g.restore();
	radians += rotationSpeed;

	//alter alpha and rotation speed
	if (mouseDown && globalAlpha > 0.1) {
		globalAlpha -= 0.008;
		rotationSpeed = 0.005;
	} else if (!mouseDown && globalAlpha < defaultAlpha) {
		globalAlpha += 0.001;
		rotationSpeed = 0.0015;
		if (globalAlpha > defaultAlpha) globalAlpha = defaultAlpha;
	}
};
