class Ray {
	constructor(pos, angle, index) {
		this.pos = pos;
		this.index = index;
		this.angleOffset = (index * Math.PI) / 180;
		this.angle = angle + this.angleOffset;

		this.finalDist;
		this.horizontalX;
		this.horizontalY;
		this.horizontalDist;
		this.verticalX;
		this.verticalY;
		this.verticalDist;

		this.maxCheck = 8;
	}

	calcDist(x1, y1, x2, y2, angle) {
		let dx = x2 - x1;
		let dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	}

	//pos, angle of the original ray (middle ray)
	horizontalRayCheck(pos, angle) {
		this.horizontalDist = Infinity;
		//degree of depth
		let dof = 0;
		//-----horizontal intersection check-----
		let aTan = -1 / Math.tan(this.angle);
		//the intersecting point of the ray
		let xIntercept, yIntercept;
		//the amount to add each time the ray moves to the next box
		let xOffset, yOffset;
		//if the ray is looking upward
		if (this.angle > Math.PI) {
			yIntercept = this.pos.y - (this.pos.y % mapInfo.boxLength) - 0.0001;
			xIntercept = (this.pos.y - yIntercept) * aTan + this.pos.x;
			yOffset = -mapInfo.boxLength;
			xOffset = -yOffset * aTan;
		}
		//if the ray is looking downward
		else if (this.angle < Math.PI && this.angle > 0) {
			yIntercept = this.pos.y - (this.pos.y % mapInfo.boxLength) + mapInfo.boxLength;
			xIntercept = (this.pos.y - yIntercept) * aTan + this.pos.x;
			yOffset = mapInfo.boxLength;
			xOffset = -yOffset * aTan;
		}
		//looking straight left or right
		else if (this.angle == 0 || this.angle == Math.PI) {
			xIntercept = this.pos.x;
			yIntercept = this.pos.y;
			dof = 8;
		}

		//position of tile in map
		let mapX, mapY, mapIndex;
		//store the x,y points and the distance if it hits a wall
		while (dof < this.maxCheck) {
			mapX = Math.floor(xIntercept / mapInfo.boxLength);
			mapY = Math.floor(yIntercept / mapInfo.boxLength);
			mapIndex = mapX + mapY * mapInfo.col;
			//if the map index is valid
			//if the ray hits a wall, save the x and y points of the intersection and calculate the distance
			if (mapIndex > 0 && mapIndex < mapInfo.col * mapInfo.row && mapInfo.map[mapIndex] == "1") {
				this.horizontalX = xIntercept;
				this.horizontalY = yIntercept;
				// this.horizontalDist = this.calcDist(this.pos.x, this.pos.y, this.horizontalX, this.horizontalY, this.angle);
				let deltaX = xIntercept - pos.x;
				let deltaY = yIntercept - pos.y;
				this.horizontalDist = deltaX * Math.cos(angle) + deltaY * Math.sin(angle);
				break;
			} else {
				xIntercept += xOffset;
				yIntercept += yOffset;
				dof++;
			}
		}
	}

	//pos, angle of the original ray (middle ray)
	verticalRayCheck(pos, angle) {
		//-----vertical intersection check-----
		let dof = 0;
		let xIntercept, yIntercept, xOffset, yOffset;
		this.verticalDist = Infinity;
		let nTan = -Math.tan(this.angle);
		//if the ray is looking left
		if (this.angle > Math.PI / 2 && this.angle < (Math.PI * 3) / 2) {
			xIntercept = this.pos.x - (this.pos.x % mapInfo.boxLength) - 0.0001;
			yIntercept = (this.pos.x - xIntercept) * nTan + this.pos.y;
			xOffset = -mapInfo.boxLength;
			yOffset = -xOffset * nTan;
		}
		//if the ray is looking right
		else if ((this.angle < Math.PI / 2 && this.angle >= 0) || (this.angle > (Math.PI * 3) / 2 && this.angle < Math.PI * 2)) {
			xIntercept = this.pos.x - (this.pos.x % mapInfo.boxLength) + mapInfo.boxLength;
			yIntercept = (this.pos.x - xIntercept) * nTan + this.pos.y;
			xOffset = mapInfo.boxLength;
			yOffset = -xOffset * nTan;
		}
		//looking straight up or down
		else if (this.angle == Math.PI / 2 || this.angle == (Math.PI * 3) / 2) {
			xIntercept = this.pos.x;
			yIntercept = this.pos.y;
			dof = 8;
		}

		//position of tile in map
		let mapX, mapY, mapIndex;
		//store the x,y points and the distance if it hits a wall
		while (dof < this.maxCheck) {
			mapX = Math.floor(xIntercept / mapInfo.boxLength);
			mapY = Math.floor(yIntercept / mapInfo.boxLength);
			mapIndex = mapX + mapY * mapInfo.col;
			//if the index is valid
			//if the ray hits a wall, save the x and y points of the intersection and calculate the distance
			if (mapIndex > 0 && mapIndex < mapInfo.col * mapInfo.row && mapInfo.map[mapIndex] == "1") {
				this.verticalX = xIntercept;
				this.verticalY = yIntercept;
				// this.verticalDist = this.calcDist(this.pos.x, this.pos.y, this.verticalX, this.verticalY, this.angle);
				let deltaX = xIntercept - pos.x;
				let deltaY = yIntercept - pos.y;
				this.verticalDist = deltaX * Math.cos(angle) + deltaY * Math.sin(angle);
				break;
			} else {
				xIntercept += xOffset;
				yIntercept += yOffset;
				dof++;
			}
		}
	}

	draw3DWall() {
		g.setColor("red");
		if (this.verticalDist < this.horizontalDist) {
			this.finalDist = this.verticalDist;
			g.line(this.pos.x, this.pos.y, this.verticalX, this.verticalY);
			g.setColor("blue");
		} else if (this.horizontalDist < this.verticalDist) {
			this.finalDist = this.horizontalDist;
			g.line(this.pos.x, this.pos.y, this.horizontalX, this.horizontalY);
			g.setColor("skyBlue");
		}

		//-----Draw 3D Walls-----
		let renderingScreenW = canvas.width / 2;
		let renderingBlockW = renderingScreenW / mapInfo.numOfRays;
		let renderingBlockH = 10000 / this.finalDist;
		renderingBlockW *= Math.cos(this.angleOffset);
		let renderingOffset = (400 - renderingBlockH) / 2;

		g.save();
		g.translate(canvas.width / 2, 0);
		// g.setColor("green");
		g.fillRect((this.index + mapInfo.numOfRays / 2) * renderingBlockW, renderingOffset, renderingBlockW, renderingBlockH);
		g.restore();
	}

	update() {}

	//trace the ray
	draw(pos, angle) {
		this.finalDist = null;
		this.pos = pos;
		//adjust the angles
		this.angle = angle + this.angleOffset;
		if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
		else if (this.angle < 0) this.angle += Math.PI * 2;

		this.horizontalRayCheck(pos, angle);
		this.verticalRayCheck(pos, angle);
		this.draw3DWall();
	}
}
