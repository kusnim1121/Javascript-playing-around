class Particle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.r = Math.random() * 3;

		this.prevX = this.x;
		this.prevY = this.y;

		let max = 120;
		let min = 50;
		this.distFromCenter = Math.random() * (max - min) + min;

		this.radians = Math.random() * Math.PI * 2;
		this.angularVel = 0.05;

		this.lastMouseX = this.x;
		this.lastMouseY = this.y;
	}

	update(mouseX, mouseY) {
		this.prevX = this.x;
		this.prevY = this.y;

		//Creates the drag effect
		this.lastMouseX += (mouseX - this.lastMouseX) * 0.05;
		this.lastMouseY += (mouseY - this.lastMouseY) * 0.05;

		this.radians += this.angularVel;
		this.x = this.lastMouseX + Math.cos(this.radians) * this.distFromCenter;
		this.y = this.lastMouseY + Math.sin(this.radians) * this.distFromCenter;
	}

	draw(g) {
		g.setColor(this.color);
		g.strokeWeight(this.r * 2);
		g.beginShape(this.prevX, this.prevY);
		g.vertex(this.x, this.y);
		g.endShape(true, true);
	}
}
