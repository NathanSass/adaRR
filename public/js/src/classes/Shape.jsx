"use strict";
class Shape extends null {
		
	constructor(params){
		super();
		this.x           = params.x;
		this.y           = params.y;
		this.w           = params.w;
		this.h           = params.h;
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
			x: 50,
			y: 50,
			w: 70,
			h: 12
		};
		super(doorParams);
		this.fillStyle   = 'purple';
		// this.lineWidth   = 0;
		// this.strokeStyle = '#979797';
		this.isDraggable = true;
	}
}

export { Shape, Room, Door };
