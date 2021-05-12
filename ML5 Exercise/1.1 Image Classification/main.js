import Graphics from "../../myLibrary/Graphics.js";
import GameLoop from "../../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = 500;
canvas.height = 600;

window.gl = gl;
window.g = g;
window.canvas = canvas;

let mobileNet;

let puffinImage;
let penguinImage;
let toucanImage;

let targetImg;

(function setup() {
	preload();
	gl.start();

	targetImg = toucanImage;

	mobileNet = ml5.imageClassifier("MobileNet", () => {
		console.log("model loaded!");
		mobileNet.classify(targetImg, gotResult);
	});
})();

function gotResult(err, result) {
	if (err) {
		console.error(err);
	} else {
		console.log(result[0]);
	}
}

function preload() {
	puffinImage = new Image();
	puffinImage.src = "./res/puffin.jpg";

	penguinImage = new Image();
	penguinImage.src = "./res/penguin.jpg";

	toucanImage = new Image();
	toucanImage.src = "./res/toucan.jpg";
}

gl.draw = function () {
	g.drawImage2(targetImg, 0, 0, targetImg.width / 2, targetImg.height / 2);
};
