const container = document.querySelector("#container");
const canvas = document.querySelector("#canvas1");
const fileInput = document.querySelector("#fileInput");
canvas.width = innerWidth;
canvas.height = innerHeight;

const gl = new GameLoop();
const g = new Graphics(canvas.getContext("2d"));

const audioElement = document.querySelector("#audio1");
// const audioElement = new Audio("./Sample_sound_1.wav");
// audioElement.src = "./Sample_sound_1.wav";
audioElement.src = "./TheFatRat & Laura Brehm - We'll Meet Again.mp3";
// audioElement.autoplay = true;
const audioContext = new AudioContext();
let audioSource;
let analyzer;

let audioPlaying = false;

//----------------Configuration-------------------
const barLength = 512; //number of bars (analyzer.fftSize)
//simpleBar, symmetricalBar, circularBar, blurryCircle, spiralLeaf, layerBalls, blobby, line
let visualize = circularBar;
//circularBar, spiralLeaf, line are good

(function setup() {
	gl.start();

	audioElement.addEventListener("playing", playSound);
	audioElement.addEventListener("ended", () => {
		audioPlaying = false;
	});

	// container.addEventListener("click", playSound);
	// container.addEventListener("ended", () => {
	// audioPlaying = false;
	// });

	fileInput.addEventListener("change", fileChanged);
})();

//Converts file into an audio source and links it to the audio play element
function fileChanged() {
	//createObjectURL takes the input and converts it into a string of 16 bit unsigned integers
	audioElement.src = URL.createObjectURL(this.files[0]);
	//updates the audio after the src or settings have been changed
	audioElement.load();
}

//plays the audio and sets up analyzer
function playSound() {
	audioElement.play();
	audioPlaying = true;
	//setting audioElement variable as the audio source
	audioSource = audioSource || audioContext.createMediaElementSource(audioElement);
	//analyzes audio time and frequency data
	analyzer = audioContext.createAnalyser();
	//connects the audio source to the analyzer
	audioSource.connect(analyzer);
	//connects analyzer to the speaker
	analyzer.connect(audioContext.destination);
	//number of audio samples we want in analyzer data file (default is 2048, possible values: 2^n (n:5 ~ 15))
	analyzer.fftSize = barLength;
}

let barHeight;
let x;
gl.draw = () => {
	g.clearRect(0, 0, canvas.width, canvas.height);
	if (analyzer) {
		//number of data values we will have in analyzer file (always half the size of fftSize => 32)
		const bufferLength = analyzer.frequencyBinCount;
		//frequency data is composed of 8bit integers (0 ~ 255)
		const dataArray = new Uint8Array(bufferLength);
		const barWidth = canvas.width / bufferLength;

		//copies current frequency data into dataArray array. Each item represents decibel values for specific frequency
		analyzer.getByteFrequencyData(dataArray);
		//visualization
		x = 0;
		visualize(dataArray, bufferLength, barWidth);
	}
};

//-------------------------VISUALIZATION VARIATIONS-------------------------------

//Simple Visualization with vertical bars
function simpleBar(dataArray, bufferLength, barWidth) {
	for (let i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i] * 2;
		let redVal = (barHeight / 20) * i;
		let greenVal = 4 * i;
		let blueVal = barHeight / 4;
		g.setColorRGB(redVal, greenVal, blueVal);
		g.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
		x += barWidth;
	}
}

//Visualization with symmetrical vertical bars
function symmetricalBar(dataArray, bufferLength, barWidth) {
	let tempBarWidth = barWidth / 2;
	for (let i = -bufferLength; i < bufferLength; i++) {
		let index = Math.abs(i);
		barHeight = dataArray[index] * 2;
		g.setColorHSL(index + 180, 100, 40);
		g.fillRect(x, canvas.height - barHeight, tempBarWidth, barHeight);
		g.setColor("white");
		// g.rect(x, canvas.height - barHeight - 30, tempBarWidth, 15);
		x += tempBarWidth;
	}
}

//circular pattern that goes over 360 degrees
function circularBar(dataArray, bufferLength, barWidth) {
	barWidth = 10;
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate((3 * i * 2 * Math.PI) / bufferLength);
		barHeight = dataArray[i] * 1.2;
		let hue = i * 1.5;
		g.setColorHSL(hue, 100, barHeight / 3.75);
		g.shadowColor(g.getFillColor());
		g.shadowBlur(5);
		g.fillRect(0, 0, barWidth, barHeight);
		//-----extra rectangles at the end-----
		// barHeight > 110 ? g.rect(0, 0, barWidth, barHeight * 1.2) : g.rect(0, 0, 0, 0);
		// barHeight > 130 ? g.rect(0, barHeight * 1.3, barWidth, barHeight * 0.2) : g.rect(0, 0, 0, 0);
		g.restore();
	}
}

//blurry circular pattern that overlap
function blurryCircle(dataArray, bufferLength, barWidth) {
	canvas.style.background = "black";
	canvas.style.filter = "blur(5px) contrast(20)";
	barWidth = 13;
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate(i + (8 * Math.PI) / bufferLength);
		barHeight = dataArray[i] * 1.5;
		let hue = i;
		g.setColorHSL(hue, 100, 50);
		g.fillRect(0, 0, barWidth, barHeight);
		g.restore();
	}
}

function spiralLeaf(dataArray, bufferLength, barWidth) {
	barWidth = 10;
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate(i * 4.16);
		barHeight = dataArray[i] * 1.5;
		let hue = 120 + i * 0.05;
		g.setColorHSL(hue, 100, 50);
		// g.fillRect(0, 0, barWidth, barHeight);
		g.g.beginPath();
		g.arc(10, barHeight / 2, barHeight / 2, 0, Math.PI / 4);
		g.fill();
		g.restore();
	}
}

function layerBalls(dataArray, bufferLength, barWidth) {
	barWidth = 10;
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate((2 * i * 2 * Math.PI) / bufferLength);
		barHeight = dataArray[i] * 1.2;
		let hue = i * 1.5;
		g.setColorHSL(hue, 100, 50);
		g.strokeWeight(barHeight / 30);
		g.lineCap("round");
		g.line(0, 0, 0, barHeight);
		g.fillCircle(0, barHeight + barHeight / 5, barHeight / 20);
		g.fillCircle(0, barHeight + barHeight / 2, barHeight / 15);
		g.restore();
	}
}

function blobby(dataArray, bufferLength, barWidth) {
	canvas.style.background = "black";
	canvas.style.filter = "blur(20px) contrast(10)";
	barWidth = 10;
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate((2 * i * 2 * Math.PI) / bufferLength);
		barHeight = dataArray[i] * 1.5;
		// let hue = i / 2;
		// g.setColorHSL(50, 100, 50);
		g.setColor("yellow");
		g.fillCircle(0, barHeight / 4, barHeight / 3);
		if (i != 0 && i % Math.floor(bufferLength / 20) == 0) {
			g.fillCircle(0, barHeight, Math.random(30) + 50);
		}
		g.restore();
	}
}

function line(dataArray, bufferLength, barWidth) {
	barWidth = 10;
	g.g.globalCompositeOperation = "lighten";
	for (let i = 0; i < bufferLength; i++) {
		g.save();
		g.translate(canvas.width / 2, canvas.height / 2);
		g.rotate(i * 3.15); //1.8, 3.15
		barHeight = dataArray[i] * 1.2;
		let hue = i * 0.05;
		g.setColorHSL(hue, 100, barHeight / 2.5);
		g.strokeWeight(3);
		g.line(0, 0, 0, barHeight);
		if (i > bufferLength * 0.6) {
			g.circle(0, 0, barHeight / 1.5);
		}
		g.restore();
	}
}
