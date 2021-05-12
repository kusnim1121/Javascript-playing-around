class Box {
	constructor(world, x, y, w, h) {
		this.body = Matter.Bodies.rectangle(x, y, w, h);
		Matter.World.add(world, this.body);
		this.w = w;
		this.h = h;
	}

	update() {}

	draw(g) {
		const pos = this.body.position;
		const angle = this.body.angle;
		g.setColor("coral");
		g.save();
		g.translate(pos.x, pos.y);
		g.rotate(angle);
		g.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
		g.strokeWeight(2);
		g.setColor("white");
		g.rect(-this.w / 2, -this.h / 2, this.w, this.h);
		g.restore();
	}
}
