class Circle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;

		this.r = 1;
		this.growing = true;
	}

	grow() {
		this.r++;
	}

	checkEdge() {
		//if the circle meets the boundary, it stops growing
		if (
			this.x + this.r > canvas.width ||
			this.x - this.r < 0 ||
			this.y + this.r > canvas.height ||
			this.y - this.r < 0
		) {
			this.growing = false;
		}
		for (const c of circles) {
			//do not check with itself
			if (c.x == this.x && c.y == this.y) continue;
			const dx = this.x - c.x;
			const dy = this.y - c.y;
			const distSq = dx * dx + dy * dy;
			const distFromCenterSq = (this.r + c.r) * (this.r + c.r);
			if (distSq <= distFromCenterSq) {
				this.growing = false;
				c.growing = false;
				break;
			}
		}
	}

	update() {
		if (this.growing) this.grow();
		this.checkEdge();
	}

	draw(g) {
		g.setColor(this.color);
		g.fillCircle(this.x, this.y, this.r);
		// g.strokeWeight(2);
		// g.circle(this.x, this.y, this.r);
	}
}
