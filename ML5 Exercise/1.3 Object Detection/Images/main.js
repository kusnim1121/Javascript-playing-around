import Graphics from "../../../myLibrary/Graphics.js";
import GameLoop from "../../../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = 500;
canvas.height = 500;

window.gl = gl;
window.g = g;
window.canvas = canvas;

let img1, img2, img3;
let targetImg;
let detector;

(function setup() {
	preLoad();

	targetImg = img1;
	canvas.width = targetImg.width;
	canvas.height = targetImg.height;

	detector = ml5.objectDetector("cocossd", () => {
		console.log("model ready!");
		detector.detect(targetImg, gotResult);
	});
})();

async function preLoad() {
	let loaded = new Promise((resolve, reject) => {
		img1 = new Image();
		img1.src = "./res/dog_cat1.jpeg";
		img2 = new Image();
		img2.src = "./res/dog_cat2.jpeg";
		img3 = new Image();
		img3.src = "./res/wolf.jpg";
	});

	await Promise.all([loaded]);
}

function gotResult(error, result) {
	if (error) {
		console.error(error);
	} else {
		console.log(result);

		g.drawImage1(targetImg, 0, 0);
		if (result.length > 0) {
			for (let i = 0; i < result.length; i++) {
				let confidence = result[i].confidence * 100;

				g.setColor("red");
				g.strokeWeight(3);
				g.rect(result[i].x, result[i].y, result[i].width, result[i].height);

				g.setFont("14px bolder arial");
				g.setColor("black");
				g.fillText(result[i].label, result[i].x + 5, result[i].y + 15);
				g.fillText(confidence.toFixed(2) + "%", result[i].x + 5, result[i].y + 30);
			}
		}
	}
}

gl.draw = function () {};
