import Graphics from "../myLibrary/Graphics.js";
import GameLoop from "../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const g = new Graphics(ctx);
const gl = new GameLoop();

canvas.width = 700;
canvas.height = 700;

const c = 5;
let n = 0;
let alpha = 137.3;
//alpha can be either 137.3, 137.5, 137.6 for specific shapes
//http://algorithmicbotany.org/papers/abop/abop-ch4.pdf

(function setup() {
	gl.start();
	g.setColor("black");
	g.fillRect(0, 0, canvas.width, canvas.height);
})();

gl.draw = function () {
	g.save();
	g.translate(canvas.width / 2, canvas.height / 2);
	const angle = (Math.PI / 180) * n * alpha;
	const radius = c * Math.sqrt(n);
	const x = radius * Math.cos(angle);
	const y = radius * Math.sin(angle);
	g.setColorHSL(n % 361, 100, 50);
	g.fillCircle(x, y, 3);
	n++;
	g.restore();

	//increase alpha slowly
	// if (n % 60 == 0) {
	// 	alpha += 0.001;
	// }
};
