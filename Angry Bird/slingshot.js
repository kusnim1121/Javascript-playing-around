class SlingShot {
	constructor(world, x, y, body) {
		let options = {
			pointA: {
				x: x,
				y: y,
			},
			bodyB: body,
			stiffness: 0.1,
			length: 10,
		};
		this.sling = Matter.Constraint.create(options);
		Matter.World.add(world, this.sling);
	}

	fly() {
		this.sling.bodyB = null;
	}

	attach(body) {
		this.sling.bodyB = body;
	}

	draw(g) {
		if (this.sling.bodyB) {
			const posA = this.sling.pointA;
			const posB = this.sling.bodyB.position;
			g.setColor("white");
			g.line(posA.x, posA.y, posB.x, posB.y);
		}
	}
}
