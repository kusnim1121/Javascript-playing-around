import GameLoop from "../myLibrary/GameLoop.js";
import Graphics from "../myLibrary/Graphics.js";
import Noise from "../myLibrary/Noise.js";
import PerlinNoise from "../myLibrary/PerlinNoise.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

const simpleNoise = new Noise();
const perlinNoise = new PerlinNoise();

canvas.width = 500;
canvas.height = 500;

let xoff = 0;
let yoff = 0;
let zoff = 0;

(function setup() {
	gl.start();
})();

gl.draw = function () {
	xoff = 0;
	yoff = 0;
	let inc = 0.01;
	let img = g.getImageData(0, 0, canvas.width, canvas.height);
	let pixels = img.data;
	g.clearRect(0, 0, canvas.width, canvas.height);
	for (let j = 0; j < canvas.height; j++) {
		xoff = 0;
		for (let i = 0; i < canvas.width; i++) {
			// let val = perlinNoise.noise(xoff, yoff, zoff) * 255;
			let val = ((simpleNoise.simplex3(xoff, yoff, zoff) + 1) / 2) * 255;
			let index = (i + j * canvas.width) * 4;
			img.data[index + 0] = val;
			img.data[index + 1] = val;
			img.data[index + 2] = val;
			img.data[index + 3] = 255;
			xoff += inc;
		}
		yoff += inc;
	}
	g.putImageData1(img, 0, 0);
	zoff += 0.1;
};
