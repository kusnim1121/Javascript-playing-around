class Point {
	constructor(x, y, userData) {
		this.x = x;
		this.y = y;
		this.userData = userData;
	}

	draw() {
		g.point(this.x, this.y, 3);
	}
}

class Rectangle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	contains(point) {
		return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
	}

	//area is rectangle
	include(area) {
		return this.x <= area.x && this.x + this.w >= area.x + area.w && this.y <= area.y && this.y + this.h >= area.y + area.h;
	}

	//range is rectangle
	intersect(range) {
		return !(range.x + range.w < this.x || range.x > this.x + this.w || range.y + range.h < this.y || range.y > this.y + this.h);
	}

	draw() {
		g.setColor("white");
		g.rect(this.x, this.y, this.w, this.h);
	}
}

class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.rSq = r * r;
	}

	contains(point) {
		const dx = this.x - point.x;
		const dy = this.y - point.y;
		return dx * dx + dy * dy < this.r * this.r;
	}

	//check if rectangle is entirely included in a circle
	include(rect) {
		let dx = Math.max(Math.abs(this.x - rect.x), Math.abs(this.x - (rect.x + rect.w)));
		let dy = Math.max(Math.abs(this.y - rect.y), Math.abs(this.y - (rect.y + rect.h)));
		return dx * dx + dy * dy < this.r * this.r;
	}

	//range is an instance of Rectangle in this case
	//Collision detection between circle and rectangle
	intersect(rect) {
		//find the x and y distance between the center of the circle and rectangle
		const distX = Math.abs(this.x - rect.x - rect.w / 2);
		const distY = Math.abs(this.y - rect.y - rect.h / 2);

		//if the circle does not even meet with the edges, return false
		if (distX > rect.w / 2 + this.r) return false;
		if (distY > rect.h / 2 + this.r) return false;

		//After above condition, they intersect for sure if either of the conditions satisfy
		if (distX <= rect.w / 2) return true;
		if (distY <= rect.h / 2) return true;

		//The above condition does not account for corner collision of rectangle
		//detect collision at rectangle corner
		var dx = distX - rect.w / 2;
		var dy = distY - rect.h / 2;
		return dx * dx + dy * dy <= this.r * this.r;
	}

	draw() {
		g.setColor("green");
		g.circle(this.x, this.y, this.r);
	}
}

class Quadtree {
	constructor(bound, capacity) {
		//Error detection
		if (!bound) {
			throw TypeError("bound is null or undefined");
		}
		if (!(bound instanceof Rectangle)) {
			throw TypeError("bound should be a Rectangle");
		}
		if (typeof capacity !== "number") {
			throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
		}
		if (capacity < 1) {
			throw RangeError("capacity must be greater than 0");
		}

		this.bound = bound;
		this.capacity = capacity;

		this.points = [];
		this.divided = false;
	}

	query(range, found) {
		//if found is not defined (if this is the initial call), create and empty array
		if (!found) found = [];
		//if there is no intersection, just return
		if (!range.intersect(this.bound)) return;
		else {
			//recursively call query function until reach lowest quadrant
			if (this.divided) {
				this.topLeft.query(range, found);
				this.topRight.query(range, found);
				this.botLeft.query(range, found);
				this.botRight.query(range, found);
			} else {
				//in the lowest quadrant, push the points inside the range
				//if the entire region is within, push all the points without checking
				if (range.include(this.bound)) {
					this.points.forEach((p) => found.push(p));
				} else {
					for (let point of this.points) {
						if (range.contains(point)) {
							found.push(point);
						}
					}
				}
			}
		}
		return found;
	}

	subdivide() {
		const x = this.bound.x;
		const y = this.bound.y;
		const w = this.bound.w;
		const h = this.bound.h;

		let tl = new Rectangle(x, y, w / 2, h / 2);
		this.topLeft = new Quadtree(tl, this.capacity);
		let tr = new Rectangle(x + w / 2, y, w / 2, h / 2);
		this.topRight = new Quadtree(tr, this.capacity);
		let bl = new Rectangle(x, y + h / 2, w / 2, h / 2);
		this.botLeft = new Quadtree(bl, this.capacity);
		let br = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
		this.botRight = new Quadtree(br, this.capacity);

		//distribute the points to the newly created sub-quadtrees
		this.points.forEach((p) => {
			if (this.topLeft.bound.contains(p)) {
				this.topLeft.points.push(p);
			} else if (this.topRight.bound.contains(p)) {
				this.topRight.points.push(p);
			} else if (this.botLeft.bound.contains(p)) {
				this.botLeft.points.push(p);
			} else if (this.botRight.bound.contains(p)) {
				this.botRight.points.push(p);
			}
		});
		this.divided = true;
	}

	insert(point) {
		if (!this.bound.contains(point)) return false;
		if (this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		} else {
			if (!this.divided) {
				this.subdivide();
			}
			if (this.topLeft.insert(point)) return true;
			else if (this.topRight.insert(point)) return true;
			else if (this.botLeft.insert(point)) return true;
			else if (this.botRight.insert(point)) return true;
		}
	}

	draw() {
		g.setColor("white");
		if (this.divided) {
			this.topLeft.draw();
			this.topRight.draw();
			this.botLeft.draw();
			this.botRight.draw();
		} else {
			this.bound.draw(this.bound.x, this.bound.y, this.bound.w, this.bound.h);
		}

		g.setColor("white");
		this.points.forEach((p) => p.draw());
	}

	clear() {
		this.points = [];
		this.divided = false;
	}
}
