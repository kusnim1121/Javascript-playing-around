class Rectangle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	update() {}

	findDistToTarget(targetPoint) {
		let dx = Math.max(this.x - targetPoint.x, 0, targetPoint.x - (this.x + this.w));
		let dy = Math.max(this.y - targetPoint.y, 0, targetPoint.y - (this.y + this.h));
		return Math.sqrt(dx * dx + dy * dy);
	}

	draw() {
		// g.setColorRGBA(255, 255, 255, 0.5);
		g.setColor("white");
		g.fillRect(this.x, this.y, this.w, this.h);
	}
}
