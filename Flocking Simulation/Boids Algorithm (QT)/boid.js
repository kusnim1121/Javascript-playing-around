class Boid {
	constructor(x, y) {
		this.pos = new Vector(x, y);
		this.vel = new Vector();
		this.acc = new Vector();

		this.maxSpeed = 3;
		this.maxForce = 0.25;

		this.vel.randomizeMinMax(-10, 10);

		this.alignmentRadius = 50;
		this.coherenceRadius = 50;
		this.separationRadius = 40;
		this.maxPerceptionRadius = Math.max(this.alignmentRadius, this.coherenceRadius, this.separationRadius);
	}

	checkEdge() {
		if (this.pos.x > canvas.width) {
			this.pos.x = 0;
		} else if (this.pos.x < 0) {
			this.pos.x = canvas.width;
		} else if (this.pos.y > canvas.height) {
			this.pos.y = 0;
		} else if (this.pos.y < 0) {
			this.pos.y = canvas.height;
		}
	}

	alignment(boids) {
		const steering = new Vector();
		let totalWithinPerception = 0;
		for (const other of boids) {
			//skips checking itself
			if (other == this) continue;
			let dist = Vector.subt(other.pos, this.pos).mag();
			//if the boid is within the perception radius
			if (dist < this.alignmentRadius) {
				steering.add(other.vel);
				totalWithinPerception++;
			}
		}
		if (totalWithinPerception > 0) {
			steering.divide(totalWithinPerception);
			steering.setMag(this.maxSpeed);
			steering.subt(this.vel);
			steering.limit(this.maxForce);
		}
		this.acc.add(steering);
	}

	coherence(boids) {
		const steering = new Vector();
		let totalWithinPerception = 0;
		for (const other of boids) {
			//if the boid is within the perception radius
			let dist = Vector.subt(other.pos, this.pos).mag();
			if (dist < this.coherenceRadius) {
				steering.add(other.pos);
				totalWithinPerception++;
			}
		}
		//count itself as well, when it is with other boids
		if (totalWithinPerception > 1) {
			steering.divide(totalWithinPerception);
			steering.subt(this.pos);
			steering.setMag(this.maxSpeed);
			steering.subt(this.vel);
			steering.limit(this.maxForce);
		}
		this.acc.add(steering);
	}

	separation(boids) {
		const steering = new Vector();
		let totalWithinPerception = 0;
		for (const other of boids) {
			if (other == this) continue;
			//if the boid is within the perception radius
			let diff = Vector.subt(this.pos, other.pos);
			if (diff.mag() < this.separationRadius) {
				diff.divide(diff.mag() * diff.mag());
				steering.add(diff);
				totalWithinPerception++;
			}
		}
		if (totalWithinPerception > 0) {
			steering.divide(totalWithinPerception);
			steering.setMag(this.maxSpeed);
			steering.subt(this.vel);
			steering.limit(this.maxForce);
		}
		this.acc.add(steering);
	}

	update(boids) {
		this.acc.mult(0);
		this.alignment(boids);
		this.coherence(boids);
		this.separation(boids);
		this.checkEdge();
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
	}

	draw(g) {
		g.setColor("DarkRed");
		g.save();
		g.translate(this.pos.x, this.pos.y);
		g.rotate(this.vel.directionRad());
		g.beginShape(0, 0);
		g.vertex(0, -3);
		g.vertex(10, 0);
		g.vertex(0, 3);
		g.endShape(true, true);
		g.restore();
	}
}
