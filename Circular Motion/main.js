import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import ColorGenerator from "../myLibrary/ColorGenerator.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();
const colorGenerator = new ColorGenerator();

canvas.width = innerWidth;
canvas.height = innerHeight;

const particles = [];
let mouseX, mouseY;
let isFullScreen = false;

//pick color pallet
const colorPallet = colorGenerator.colors8;

(function setup() {
	gl.start();
	//detect resize
	addEventListener("resize", () => {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
	});
	//add full screen feature
	addEventListener("keydown", (e) => {
		if (!isFullScreen && e.key == "Enter") {
			canvas.requestFullscreen();
			isFullScreen = true;
		} else if (isFullScreen && e.key == "Enter") {
			document.exitFullscreen();
			isFullScreen = false;
		}
	});

	//detect mouse movement
	addEventListener("mousemove", (e) => {
		mouseX = e.x;
		mouseY = e.y;
	});

	//initialize the particles
	for (let i = 0; i < 70; i++) {
		const x = canvas.width / 2;
		const y = canvas.height / 2;

		const color = colorPallet[Math.floor(Math.random() * colorPallet.length)];
		particles.push(new Particle(x, y, color));
	}
})();

gl.update = function () {
	particles.forEach((p) => p.update(mouseX, mouseY));
};

gl.draw = function () {
	g.setColorRGBA(255, 255, 255, 0.05);
	g.fillRect(0, 0, canvas.width, canvas.height);
	particles.forEach((p) => p.draw(g));
};
