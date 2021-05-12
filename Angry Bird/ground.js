class Ground extends Box {
	constructor(world, x, y, w, h) {
		super(world, x, y, w, h);
		Matter.Body.setStatic(this.body, true);
	}
}
