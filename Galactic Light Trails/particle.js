class Particle {
	constructor(x, y, r, color) {
		this.x = x;
		this.y = y;
		this.r = r;

		this.color = color;
	}

	draw(g) {
		g.setColor(this.color);
		g.shadowColor(this.color);
		g.shadowBlur(3);
		g.fillCircle(this.x, this.y, this.r);
	}
}
