class Player {
	constructor(x, y) {
		this.pos = new Vector(x, y);
		this.vel = new Vector();

		this.speed = 3;
		this.rotateSpeed = 0.05;
		this.angle = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.rotateRight = false;
		this.rotateLeft = false;

		addEventListener("keydown", this.keyDown.bind(this));
		addEventListener("keyup", this.keyUp.bind(this));

		this.rays = [];
		for (let i = -mapInfo.numOfRays / 2; i < mapInfo.numOfRays / 2; i++) {
			this.rays.push(new Ray(this.pos, this.angle, i));
		}
	}

	update() {
		//rotate player
		if (this.rotateRight) {
			this.angle += this.rotateSpeed;
			if (this.angle >= Math.PI * 2) this.angle -= Math.PI * 2;
		} else if (this.rotateLeft) {
			this.angle -= this.rotateSpeed;
			if (this.angle <= 0) this.angle += Math.PI * 2;
		}
		this.vel.x = Math.cos(this.angle);
		this.vel.y = Math.sin(this.angle);
		this.vel.mult(this.speed);

		//move player
		if (this.moveForward) {
			let nextPos = Vector.add(this.pos, this.vel);
			let mapX, mapY, mapIndex;
			mapX = Math.floor(nextPos.x / mapInfo.boxLength);
			mapY = Math.floor(nextPos.y / mapInfo.boxLength);
			mapIndex = mapX + mapY * mapInfo.col;
			//if the next position is not a wall,
			if (mapIndex > 0 && mapIndex < mapInfo.col * mapInfo.row && mapInfo.map[mapIndex] == "0") {
				this.pos.add(this.vel);
			}
		} else if (this.moveBackward) {
			let nextPos = Vector.add(this.pos, this.vel.mult(-1));
			let mapX, mapY, mapIndex;
			mapX = Math.floor(nextPos.x / mapInfo.boxLength);
			mapY = Math.floor(nextPos.y / mapInfo.boxLength);
			mapIndex = mapX + mapY * mapInfo.col;
			//if the next position is not a wall,
			if (mapIndex > 0 && mapIndex < mapInfo.col * mapInfo.row && mapInfo.map[mapIndex] == "0") {
				this.pos.add(this.vel);
			}
		}

		//update the rays
		this.rays.forEach((ray) => ray.update());
	}

	draw() {
		g.setColor("yellow");
		g.fillCircle(this.pos.x, this.pos.y, 10);

		g.save();
		g.translate(this.pos.x, this.pos.y);
		g.rotate(this.angle);
		g.line(0, 0, 30, 0);
		g.restore();

		//draw the rays
		this.rays.forEach((ray) => ray.draw(this.pos, this.angle));
	}

	keyDown(e) {
		if (e.key == "ArrowUp") {
			this.moveForward = true;
		} else if (e.key == "ArrowDown") {
			this.moveBackward = true;
		} else if (e.key == "ArrowLeft") {
			this.rotateLeft = true;
		} else if (e.key == "ArrowRight") {
			this.rotateRight = true;
		}
	}

	keyUp(e) {
		if (e.key == "ArrowUp") {
			this.moveForward = false;
		} else if (e.key == "ArrowDown") {
			this.moveBackward = false;
		} else if (e.key == "ArrowLeft") {
			this.rotateLeft = false;
		} else if (e.key == "ArrowRight") {
			this.rotateRight = false;
		}
	}
}
