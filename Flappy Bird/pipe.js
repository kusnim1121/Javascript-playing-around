class Pipe {
	constructor() {
		let spacing = (Math.random() * canvas.height) / 8 + canvas.height / 4;
		let centerY = Math.random() * (canvas.height - spacing) + spacing / 2;

		this.topLength = centerY - spacing / 2;
		this.botLength = canvas.height - centerY - spacing / 2;
		this.x = canvas.width;
		this.speed = 2;
		this.w = 50;
		this.hit = false;
	}

	checkOffScreen() {
		return this.x + this.w < 0;
	}

	checkCollision(bird) {
		if (this.x < bird.pos.x + bird.r && this.x + this.w > bird.pos.x - bird.r) {
			if (bird.pos.y - bird.r < this.topLength || bird.pos.y + bird.r > canvas.height - this.botLength) {
				this.hit = true;
				return true;
			}
		}
		this.hit = false;
		return false;
	}

	update() {
		this.x -= this.speed;
	}

	draw() {
		if (!this.hit) g.setColor("white");
		else g.setColor("red");
		g.fillRect(this.x, 0, this.w, this.topLength);
		g.fillRect(this.x, canvas.height - this.botLength, this.w, this.botLength);
	}
}
