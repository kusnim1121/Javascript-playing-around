class Particle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;

		this.touching = false;
	}

	move() {
		this.x += Math.random() * 2 - 1;
		this.y += Math.random() * 2 - 1;
	}

	checkTouching(other) {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const distSq = dx * dx + dy * dy;
		const dist = Math.sqrt(distSq);
		// return distSq < (this.r + other.r) * (this.r + other.r);
		return dist <= this.r + other.r;
	}

	draw() {
		if (!this.touching) {
			g.setColor("gray");
		} else if (this.touching) {
			g.setColor("white");
		}
		g.fillCircle(this.x, this.y, this.r);
	}
}
