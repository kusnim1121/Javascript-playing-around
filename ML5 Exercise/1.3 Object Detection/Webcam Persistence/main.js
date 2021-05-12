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
let detections = [];
let modelReady = false;
let idCount = 0;

//DON'T KNOW HOW THIS WORKS YET
(function setup() {
	preLoad();
	gl.start();

	detector = ml5.objectDetector("cocossd", () => {
		console.log("model loaded");
		modelReady = true;
	});
})();

function preLoad() {
	// Get access to the camera!
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Not adding `{ audio: true }` since we only want video now
		navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
			//video.src = window.URL.createObjectURL(stream);
			video.srcObject = stream;
			video.play();
			//in order to not display the video itself
			video.style.display = "none";
			console.log("video loaded");
			video.onloadeddata = function () {
				while (true) {
					if (modelReady) {
						detector.detect(video, gotDetection);
						break;
					}
				}
			};
		});
	}
}

function dist(x1, y1, x2, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end;
}
function gotDetection(error, result) {
	if (error) {
		console.error(error);
	} else {
		let labels = Object.keys(detections);
		for (let label of labels) {
			let objects = detections[label];
			for (let object of objects) {
				object.taken = false;
			}
		}

		for (let i = 0; i < result.length; i++) {
			let object = result[i];
			let label = object.label;

			if (detections[label]) {
				let existing = detections[label];
				if (existing.length == 0) {
					object.id = idCount;
					idCount++;
					existing.push(object);
					object.timer = 100;
				} else {
					//find the object closest to
					let recordDist = Infinity;
					let closest = null;
					for (let candidate of existing) {
						let d = dist(candidate.x, candidate.y, object.x, object.y);
						if (d < recordDist && !candidate.taken) {
							recordDist = d;
							closest = candidate;
						}
					}
					if (closest) {
						// copy x,y,w,h
						let amt = 0.75; //0.75;
						closest.x = lerp(object.x, closest.x, amt);
						closest.y = lerp(object.y, closest.y, amt);
						closest.width = lerp(object.width, closest.width, amt);
						closest.height = lerp(object.height, closest.height, amt);
						closest.taken = true;
						closest.timer = 100;
					} else {
						object.id = idCount;
						idCount++;
						existing.push(object);
						object.timer = 100;
					}
				}
			} else {
				object.id = idCount;
				idCount++;
				detections[label] = [object];
				object.timer = 100;
			}
		}
	}
	detector.detect(video, gotDetection);
}

gl.draw = function () {
	g.drawImage2(video, 0, 0, video.width, video.height);

	let labels = Object.keys(detections);
	for (let label of labels) {
		let objects = detections[label];
		for (let i = objects.length - 1; i >= 0; i--) {
			let object = objects[i];
			if (object.label !== "person") {
				g.strokeStyle("red");
				g.strokeWeight(4);
				g.setColorRGBA(255, 0, 0, object.timer);
				g.rect(object.x, object.y, object.width, object.height);
				g.setFont("32px arial");
				g.fillText(object.label + " " + object.id, object.x + 10, object.y + 24);
			}
			object.timer -= 2;
			if (object.timer < 0) {
				objects.splice(i, 1);
			}
		}
	}
};
