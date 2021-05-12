// import Vector from "../../myLibrary/Vector";

class Ray {
	constructor(pos, dirAngle, angleOffset) {
		this.pos = pos;
		this.dirAngle = dirAngle;
		this.angleOffset = (angleOffset * Math.PI) / 180;

		this.endPoint = this.pos.clone();
		this.cnt = 0;
		this.hit = false;
	}

	rayCast() {
		while (true) {
			this.cnt++;
			if (this.cnt > 10) break;

			let dist = this.checkDistToObjects(this.endPoint);
			if (dist < 0) dist = 0;
			if (dist) {
				g.setColor("yellow");
				g.point(this.endPoint.x, this.endPoint.y, 2);
				g.circle(this.endPoint.x, this.endPoint.y, dist);
				let plusPos = Vector.fromAngle(this.dirAngle + this.angleOffset).mult(dist);
				this.endPoint.add(plusPos);
				this.rayCast();
			}
			if (dist < 1) {
				this.hit = true;
				break;
			}
		}
	}

	//check the distance to the closest object
	checkDistToObjects(pos) {
		let maxDist = Infinity;
		objects.forEach((object) => {
			let dist = object.findDistToTarget(pos);
			if (dist < maxDist) {
				maxDist = dist;
			}
		});
		if (maxDist == Infinity) return null;
		return maxDist;
	}

	update(pos, dirAngle) {
		this.pos = pos;
		this.dirAngle = dirAngle;
	}

	draw() {
		g.setColor("yellow");
		if (this.hit) {
			g.line(this.pos.x, this.pos.y, this.endPoint.x, this.endPoint.y);
		}
		g.save();
		g.translate(this.pos.x, this.pos.y);
		g.rotate(this.dirAngle + this.angleOffset);
		g.setGlobalAlpha(0.05);
		g.line(0, 0, 50, 0);
		g.restore();

		this.cnt = 0;
		this.hit = false;
		this.endPoint = this.pos.clone();
		this.rayCast(this.pos);
	}
}
