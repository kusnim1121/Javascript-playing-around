class Star {
	constructor(x, y, z, r, color, speed) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;

		this.speed = speed;
		this.defaultSpeed = speed;

		this.color = color;
		this.twinkleRate = 0.001;
		this.isTwinkle = false;

		//for background stars
		this.renderX = this.x;
		this.renderY = this.y;
		this.renderR = this.r;
	}

	makeFaster() {
		this.speed += 0.04;
		this.speed = gl.clamp(this.speed, this.defaultSpeed, this.defaultSpeed * 3);
	}
	makeSlower() {
		this.speed -= 0.02;
		this.speed = gl.clamp(this.speed, this.defaultSpeed, this.defaultSpeed * 3);
	}

	update() {
		this.renderX = gl.remap(this.x / this.z, -1 / 2, 1 / 2, -canvas.width / 2, canvas.width / 2);
		this.renderY = gl.remap(this.y / this.z, -1 / 2, 1 / 2, -canvas.height / 2, canvas.height / 2);
		this.renderR = gl.remap(this.z, 0, canvas.width, this.r, 0);
		this.renderR = gl.clamp(this.renderR, 0, this.r);
		this.z -= this.speed;
		if (this.z < 0) {
			this.z = Math.random() * canvas.width;
		}
	}

	draw(g) {
		if (!this.isTwinkle && Math.random() < this.twinkleRate) {
			this.isTwinkle = true;
			setTimeout(() => (this.isTwinkle = false), 500);
		}
		if (this.isTwinkle) {
			g.setColor(this.color);
			g.shadowColor(this.color);
			g.shadowBlur(15);
			g.fillTwinkle(this.renderX, this.renderY, this.renderR * 3);
			g.shadowRemove();
		} else {
			g.setColor(this.color);
			g.shadowColor(this.color);
			g.shadowBlur(10);
			g.fillCircle(this.renderX, this.renderY, this.renderR);
		}
	}
}
