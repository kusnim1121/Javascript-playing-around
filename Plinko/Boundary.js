class Boundary {
	constructor(world, x, y, w, h) {
		let options = {
			isStatic: true,
			restitution: 0.5,
		};
		this.body = Matter.Bodies.rectangle(x, y, w, h, options);
		Matter.World.add(world, this.body);

		this.w = w;
		this.h = h;
	}

	update() {}

	draw(g) {
		g.setColor("purple");
		g.save();
		g.translate(this.body.position.x, this.body.position.y);
		g.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		g.restore();
	}
}
