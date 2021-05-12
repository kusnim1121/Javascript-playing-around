import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import Vector from "../myLibrary/Vector.js";

//Setup
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
window.gl = new GameLoop();
window.canvas = canvas;
window.Vector = Vector;

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
let word = [];
const page = [];
let pageIndex = 0;
const mouse = {
	pos: null,
	// the area where the particles react to the mouse
	radius: 150,
};

//background is black in css, so canvas is actually counted as transparent
(function setup() {
	init();

	//start game loop
	gl.start();
	gl.detectResize(canvas);
	gl.enableFullScreen(canvas, "Enter");

	//Add event listener
	addEventListener("mousemove", (e) => {
		if (!mouse.pos) mouse.pos = new Vector();
		mouse.pos.x = e.x;
		mouse.pos.y = e.y;
	});

	addEventListener("mousedown", () => {
		pageIndex++;
		if (pageIndex >= page.length) pageIndex = 0;
		page[pageIndex].forEach((p) => p.randomize());
	});
})();

// Initialize all the text I want to add to which page
function init() {
	word = createText(
		canvas.width / 2,
		canvas.height / 2 - 100,
		"I love you",
		5,
		10
	);
	word = word.concat(
		createText(canvas.width / 2, canvas.height / 2 + 100, "Hosu", 7, 12)
	);
	// word = createText(canvas.width / 2, canvas.height / 2, "A", 7, 10);
	page.push(word);
	word = [];
}

/**
 * Creates a particle text at desired location
 *
 * @param {Number} x x-coordinate of center of string
 * @param {Number} y y-coordinate of center of string
 * @param {String} s the string
 * @param {Number} particleSize the size of individual particles
 * @param {Number} factor by what factor do you want to multiply the size
 * @returns {Array} returns the particle array of that word
 */
function createText(x, y, s, particleSize, factor) {
	//scans the text
	g.setColor("white");
	//arial, serif, sans-serif, verdana, times new roman, courier new
	g.setFont("20px verdana");
	g.textAlign("start");
	g.textBaseline("top");
	const textMetrics = g.measureText(s);
	const width =
		Math.abs(textMetrics.actualBoundingBoxRight) +
		Math.abs(textMetrics.actualBoundingBoxLeft);
	const height =
		Math.abs(textMetrics.actualBoundingBoxAscent) +
		Math.abs(textMetrics.actualBoundingBoxDescent);
	g.clearRect(0, 0, width, height);
	g.fillText(s, 0, 0);
	const imageData = g.getImageData(0, 0, width, height);

	const shiftX = x - (width * factor) / 2;
	const shiftY = y - (height * factor) / 2;

	//makes the particle array of the scanned text
	particles = [];
	for (let i = 0; i < imageData.width; i++) {
		for (let j = 0; j < imageData.height; j++) {
			const index = (i + j * imageData.width) * 4;
			//index:R
			//index+1:G
			//index+2:B
			//index+3:A
			///choose color
			if (imageData.data[index + 3] > 128) {
				particles.push(
					new Particle(i * factor + shiftX, j * factor + shiftY, particleSize)
				);
			}
		}
	}
	return particles;
}

gl.update = function () {
	page[pageIndex].forEach((p) => p.update(mouse));
};

gl.draw = function () {
	const grd = g.createLinearGradient(0, 0, 0, canvas.height);
	grd.addColorStop(0, "#03045e");
	grd.addColorStop(1, "black");
	g.setColor(grd);
	g.fillRect(0, 0, canvas.width, canvas.height);
	page[pageIndex].forEach((p) => p.draw(g, mouse));
	// g.setColorRGBA(255, 255, 120, 0.5);
	// if (mouse.pos) {
	// 	g.fillCircle(mouse.pos.x, mouse.pos.y, 10);
	// 	g.circle(mouse.pos.x, mouse.pos.y, mouse.radius);
	// }
};
