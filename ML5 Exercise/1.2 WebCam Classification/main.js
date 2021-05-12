import Graphics from "../../myLibrary/Graphics.js";
import GameLoop from "../../myLibrary/GameLoop.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

canvas.width = 500;
canvas.height = 500;

window.gl = gl;
window.g = g;
window.canvas = canvas;

let video;
let classifier;

function loadVideo() {
	// Grab elements, create settings, etc.
	video = document.getElementById("video");
	// Get access to the camera!
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Not adding `{ audio: true }` since we only want video now
		navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
			//video.src = window.URL.createObjectURL(stream);
			video.srcObject = stream;
			video.play();
			video.style.display = "none";
		});
	}

	canvas.width = video.width;
	canvas.height = video.height;
}

let cnt = 0;
function gotResult(err, result) {
	if (err) {
		console.error(err);
	} else {
		// console.log(result[0]);
		cnt++;
		if (cnt % 20 == 0) {
			console.log("label :>> ", result[0].label);
			console.log("confidence :>> ", result[0].confidence);
		}
		classifier.classify(gotResult);
	}
}

(function setup() {
	gl.start();

	loadVideo();
	classifier = ml5.imageClassifier("mobileNet", video, () => {
		console.log("model loaded");
		classifier.classify(gotResult);
	});

	// document.getElementById("snap").addEventListener("click", function () {
	// g.drawImage2(video, 0, 0, canvas.width, canvas.height);
	// });
})();

gl.draw = function () {
	g.drawImage2(video, 0, 0, video.width, video.height);
};
