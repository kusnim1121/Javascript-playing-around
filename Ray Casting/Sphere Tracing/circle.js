class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}

	update() {}

	findDistToTarget(targetPos) {
		let dx = this.x - targetPos.x;
		let dy = this.y - targetPos.y;
		return Math.sqrt(dx * dx + dy * dy) - this.r;
	}

	draw() {
		// g.setColorRGBA(255, 255, 255, 0.5);
		g.setColor("white");
		g.fillCircle(this.x, this.y, this.r);
	}
}
