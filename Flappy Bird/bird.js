class Bird {
	constructor() {
		this.pos = new Vector(canvas.width / 2 - canvas.width / 5, canvas.height / 2);
		this.r = 10;

		this.vel = new Vector();
		this.acc = new Vector();
		this.maxVel = 11;

		addEventListener("keydown", (e) => {
			if (e.key == " ") {
				this.vel.add(new Vector(0, -liftForce));
			}
		});
	}

	applyForce(force) {
		this.acc.add(force);
	}

	update() {
		this.acc.setZero();
		this.acc.add(new Vector(0, gravityForce));
		this.vel.add(this.acc);
		this.vel.limit(this.maxVel);
		this.pos.add(this.vel);
		this.pos.y = gl.clamp(this.pos.y, 0, canvas.height);
	}

	draw() {
		g.setColor("yellow");
		g.fillCircle(this.pos.x, this.pos.y, this.r);
	}
}
