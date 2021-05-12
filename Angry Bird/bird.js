class Bird {
	constructor(world, x, y, r) {
		let options = {
			restitution: 0.4,
		};
		this.body = Matter.Bodies.circle(x, y, r, options);
		Matter.World.add(world, this.body);

		Matter.Body.setMass(this.body, this.body.mass * 2);
		this.r = r;
	}

	update() {}

	draw(g) {
		const pos = this.body.position;
		const angle = this.body.angle;
		g.setColor("cyan");
		g.save();
		g.translate(pos.x, pos.y);
		g.rotate(angle);
		g.fillCircle(0, 0, this.r);
		g.restore();
	}
}
