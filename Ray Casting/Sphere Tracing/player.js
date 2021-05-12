class Player {
	constructor(x, y) {
		this.pos = new Vector(x, y);
		this.vel = new Vector();

		this.speed = 3.5;
		this.rotateSpeed = 0.05;
		this.angle = 0;

		// this.moveForward = false;
		// this.moveBackward = false;
		// this.rotateRight = false;
		// this.rotateLeft = false;

		this.isUp = false;
		this.isDown = false;
		this.isRight = false;
		this.isLeft = false;

		addEventListener("keydown", this.keyDown.bind(this));
		addEventListener("keyup", this.keyUp.bind(this));

		this.distToClosest = 0;

		this.rays = [];
		// for (let i = -30; i < 30; i += 2) {
		// this.rays.push(new Ray(this.pos, this.angle, i));
		// }
		for (let i = 0; i < 1; i += 2) {
			this.rays.push(new Ray(this.pos, this.angle, i));
		}
	}

	update() {
		// //rotate player
		// if (this.rotateRight) {
		// 	this.angle += this.rotateSpeed;
		// } else if (this.rotateLeft) {
		// 	this.angle -= this.rotateSpeed;
		// }
		// this.vel.x = Math.cos(this.angle);
		// this.vel.y = Math.sin(this.angle);
		// this.vel.mult(this.speed);

		// //move player
		// if (this.moveForward) {
		// 	this.pos.add(this.vel);
		// } else if (this.moveBackward) {
		// 	this.pos.add(this.vel.mult(-1));
		// }

		this.vel.setZero();
		if (this.isUp) {
			this.vel.y = -this.speed;
		} else if (this.isDown) {
			this.vel.y = this.speed;
		}
		if (this.isRight) {
			this.vel.x = this.speed;
		} else if (this.isLeft) {
			this.vel.x = -this.speed;
		}
		this.pos.add(this.vel);

		//update player's rays
		this.rays.forEach((ray) => ray.update(this.pos, this.angle));
	}

	draw() {
		g.setColor("yellow");
		g.fillCircle(this.pos.x, this.pos.y, 10);
		// g.circle(this.pos.x, this.pos.y, this.distToClosest);

		this.rays.forEach((ray) => ray.draw());
	}

	keyDown(e) {
		// if (e.key == "ArrowUp") {
		// 	this.moveForward = true;
		// } else if (e.key == "ArrowDown") {
		// 	this.moveBackward = true;
		// } else if (e.key == "ArrowLeft") {
		// 	this.rotateLeft = true;
		// } else if (e.key == "ArrowRight") {
		// 	this.rotateRight = true;
		// }
		if (e.key == "ArrowUp") {
			this.isUp = true;
		} else if (e.key == "ArrowDown") {
			this.isDown = true;
		} else if (e.key == "ArrowLeft") {
			this.isLeft = true;
		} else if (e.key == "ArrowRight") {
			this.isRight = true;
		}
	}

	keyUp(e) {
		// if (e.key == "ArrowUp") {
		// 	this.moveForward = false;
		// } else if (e.key == "ArrowDown") {
		// 	this.moveBackward = false;
		// } else if (e.key == "ArrowLeft") {
		// 	this.rotateLeft = false;
		// } else if (e.key == "ArrowRight") {
		// 	this.rotateRight = false;
		// }
		if (e.key == "ArrowUp") {
			this.isUp = false;
		} else if (e.key == "ArrowDown") {
			this.isDown = false;
		} else if (e.key == "ArrowLeft") {
			this.isLeft = false;
		} else if (e.key == "ArrowRight") {
			this.isRight = false;
		}
	}
}
