//https://www.youtube.com/watch?v=goUlyp4rwiU
//https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering

import GameLoop from "../../myLibrary/GameLoop.js";
import Graphics from "../../myLibrary/Graphics.js";

const canvas = document.querySelector("canvas");
const g = new Graphics(canvas.getContext("2d"));
const gl = new GameLoop();

window.gl = gl;

canvas.width = 600;
canvas.height = 400;

let vals = [1, 2, 3, 4, 5, 6];

(function setup() {
	gl.start();
})();

function swap(arr, i, j) {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

function nextOrder(arr) {
	let largestI = -1;
	let largestJ;

	//STEP 1 Find the largest x such that P[x]<P[x+1].
	//If there is no such x, P is the last permutation.
	for (let i = 0; i < arr.length - 1; i++) {
		if (arr[i] < arr[i + 1]) {
			largestI = i;
		}
	}

	if (largestI == -1) {
		console.log("FINISHED");
		gl.pause();
		return arr;
	}

	//STEP 2 Find the largest y such that P[x]<P[y].
	for (let i = 0; i < arr.length; i++) {
		//if it satisfy the condition, and it is larger than current largestJ
		if (arr[largestI] < arr[i]) {
			largestJ = i;
		}
	}

	//STEP 3 Swap P[x] and P[y].
	swap(arr, largestI, largestJ);

	//STEP 4 Reverse P[x+1 .. n].
	//splice the array from x+1 to the end
	let tempArr = arr.splice(largestI + 1);
	tempArr.reverse();
	arr = arr.concat(tempArr);

	return arr;
}

gl.update = function () {
	vals = nextOrder(vals);
};

gl.draw = function () {
	g.setColor("black");
	g.fillRect(0, 0, canvas.width, canvas.height);

	let s = "";
	for (let i = 0; i < vals.length; i++) {
		s += vals[i];
	}

	g.setColor("white");
	g.setFont("100px arial");
	g.textAlign("center");
	g.textBaseline("middle");
	g.fillText(s, canvas.width / 2, canvas.height / 2);
};
