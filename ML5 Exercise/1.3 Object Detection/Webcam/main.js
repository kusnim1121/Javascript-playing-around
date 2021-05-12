import Graphics from "../../../myLibrary/Graphics.js";
import GameLoop from "../../../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const video = document.querySelector("video");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = 500;
canvas.height = 500;
video.width = canvas.width;
video.height = canvas.height;

window.gl = gl;
window.g = g;
window.canvas = canvas;

let detector;
let outputs = [];

(function setup() {
	preLoad();
	gl.start();
})();

let cnt = 0;
function gotResults(err, results) {
	if (err) {
		console.error(err);
	} else {
		outputs = [];
		for (let i = 0; i < results.length; i++) {
			if (cnt % 10 == 0) {
				console.log(results.length);
				console.log(results);
			}
			let output = {
				label: results[i].label,
				confidence: results[i].confidence,
				x: results[i].x,
				y: results[i].y,
				w: results[i].width,
				h: results[i].height,
			};
			outputs.push(output);
		}
	}
	detector.detect(video, gotResults);
}

//preload all the elements needed
function preLoad() {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Not adding `{ audio: true }` since we only want video now
		navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
			//video.src = window.URL.createObjectURL(stream);
			video.srcObject = stream;
			video.onloadeddata = function () {
				console.log("video loaded");
				detector = ml5.objectDetector("cocossd", () => {
					console.log("model loaded");
					detector.detect(video, gotResults);
				});
			};
			video.play();
			//in order to not display the video itself
			video.style.display = "none";
		});
	}
}

gl.draw = function () {
	g.drawImage2(video, 0, 0, video.width, video.height);
	for (let i = 0; i < outputs.length; i++) {
		let output = outputs[i];
		g.setColor("red");
		g.rect(output.x, output.y, output.w, output.h);
		g.setColor("black");
		g.setFont("14px bolder arial");
		g.fillText(output.label, output.x + 5, output.y + 15);
		g.fillText(output.confidence.toFixed(5), output.x + 5, output.y + 30);
	}
};
