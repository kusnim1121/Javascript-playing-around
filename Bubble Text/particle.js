class Particle {
	constructor(x, y, particleSize) {
		this.pos = new Vector(x, y);
		this.size = particleSize;
		this.baseSize = particleSize;
		//by doing this.x, not x, you can move initial position
		this.basePos = new Vector(x, y);
		this.vel = new Vector();
		this.acc = new Vector();
		//density: determine how heavy each particle is, and their speed
		this.density = Math.random() * 5 + 1;

		this.maxSpeed = 5;
		this.maxSeekForce = 10;
		this.maxAvoidMouseForce = 30;

		//randomize initial position
		this.randomize();
	}

	randomize() {
		this.pos.randomize();
		this.pos.mult(new Vector(canvas.width, canvas.height));
	}

	applyForce(force) {
		this.acc.add(force);
	}

	seekOriginalPos() {
		const desire = Vector.subt(this.basePos, this.pos);
		let speed = this.maxSpeed;
		if (desire.mag() < 100) {
			speed = gl.remap(desire.mag(), 0, 100, 0, this.maxSpeed);
		}
		desire.limit(speed);
		const steering = Vector.subt(desire, this.vel);
		steering.limit((this.maxSeekForce * 1) / this.density);
		this.applyForce(steering);
	}

	avoidMouse(mouse) {
		//calculates distance from the mouse
		const forceFromMouse = Vector.subt(this.pos, mouse.pos);
		const dist = forceFromMouse.mag();
		if (dist < mouse.radius) {
			const speed = gl.remap(dist, 0, mouse.radius, this.maxAvoidMouseForce, 0);
			forceFromMouse.setMag((speed * 1) / this.density);
			this.applyForce(forceFromMouse);
		} else {
		}
	}

	update(mouse) {
		this.acc.setZero();
		if (mouse.pos) {
			this.avoidMouse(mouse);
		}
		this.seekOriginalPos();
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}

	draw(g, mouse) {
		g.fillStyle("rgba(255,255,255,0.8");
		g.strokeStyle("rgba(34,147,214,1");
		g.strokeWeight(2);
		g.shadowColor(g.getStrokeColor());
		g.shadowBlur(5);

		//change bubble size according to distance from mouse
		const dist = Vector.subt(this.pos, mouse.pos).mag();
		if (dist < (mouse.radius * 2) / 3) {
			this.size = this.baseSize * 2.5;
			// g.fillCircle(this.pos.x, this.pos.y, this.size);
			g.circle(this.pos.x, this.pos.y, this.size);
			g.fillCircle(this.pos.x - 5, this.pos.y - 5, this.size / 3);
			g.fillCircle(this.pos.x + 4, this.pos.y + 4, this.size / 4);
		} else if (dist < mouse.radius) {
			this.size = this.baseSize * 1.8;
			// g.fillCircle(this.pos.x, this.pos.y, this.size);
			g.circle(this.pos.x, this.pos.y, this.size);
			g.fillCircle(this.pos.x - 3, this.pos.y - 3, this.size / 4);
		} else {
			this.size = this.baseSize;
			// g.fillCircle(this.pos.x, this.pos.y, this.size);
			g.circle(this.pos.x, this.pos.y, this.size);
			g.fillCircle(this.pos.x - 1, this.pos.y - 1, this.size / 4);
		}
	}
}
