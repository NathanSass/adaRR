"use strict";
class Shape extends null {
		
	constructor(params){
		super();
		this.x           = params.x;
		this.y           = params.y;
		this.w           = params.w;
		this.h           = params.h;
		this.fillStyle   = "#4A4A4A";
		this.isDraggable = true;
	}
	
	// Draws this shape to a given context
	draw(ctx) {
		
		ctx.beginPath();
		
		ctx.fillStyle   = this.fillStyle;
	    ctx.fillRect(this.x, this.y, this.w, this.h);
		
		if (this.lineWidth && this.strokeStyle) {
			ctx.lineWidth   = this.lineWidth;
			ctx.strokeStyle = this.strokeStyle;
		    ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.stroke();
		}

		ctx.closePath();
	}

	// Determine if a point is inside the shape's bounds
	contains(mx, my) {
		// All we have to do is make sure the Mouse X,Y fall in the area between
		// the shape's X and (X + Width) and its Y and (Y + Height)
		return  (this.x <= mx) && (this.x + this.w >= mx) &&
		      (this.y <= my) && (this.y + this.h >= my);
	}
}


class Room extends Shape {
	constructor(params) {
		super(params);
		
		this.fillStyle   = '#F5F5F5';
		this.lineWidth   = 10;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
}

class Door extends Shape {
	constructor(params){
		var doorParams = {
			x: 250,
			y: 250,
			w: 70,
			h: 10
		};
		super(doorParams);
		this.fillStyle   = '#D8D8D8';
		this.isDraggable = true;
		this.isHoriz     = true;
	}

	makeHoriz() {
		var side1 = this.w;
		var side2 = this.h;
		if (side1 < side2) {
			this.w = side2;
			this.h = side1;
		}
		
		this.isHoriz = true;
	}

	makeVert() {
		var side1 = this.w;
		var side2 = this.h;
		
		if (side1 > side2) {
			this.w = side2;
			this.h = side1;
		}

		this.isHoriz = false;
	}

	toggleOrientation() {
		if (this.isHoriz) {
			this.makeVert();
		} else {
			this.makeHoriz();
		}
	}
}

export { Shape, Room, Door };
