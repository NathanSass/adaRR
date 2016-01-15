import { Shape } from "./Shape.jsx";
"use strict";

class Toilet extends Shape {
	constructor(params) {
		var note         = params.room.note,
			toilet       = params.room.toilet,
			rotation     = params.room.rotation,
			wallWidth    = 10,
			canvasOffset = params.canvasOffset,
			distFromWall = params.room.toilet.loc.distFromWall,
		
			superParams  = {};
			

		// /*
		// 	Takes the toilet width & height.
		// 	Translates the orientation to match the rotation.
		// */
		switch ( rotation ) {
			case 0:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + canvasOffset - distFromWall;
					superParams.y = toilet.loc.y + canvasOffset	;
				} else {
					superParams.x = toilet.loc.x + canvasOffset - toilet.bound.w + distFromWall;
					superParams.y = toilet.loc.y + canvasOffset;
				}
				break;
			case 90:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + canvasOffset - toilet.bound.h;
					superParams.y = toilet.loc.y + canvasOffset - distFromWall;																																				
				} else {
					superParams.x = toilet.loc.x + canvasOffset - toilet.bound.h;
					superParams.y = toilet.loc.y + canvasOffset - toilet.bound.w + distFromWall;																																				
				}
				break;
			case 180:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + canvasOffset - toilet.bound.w + distFromWall;
					superParams.y = toilet.loc.y + canvasOffset - toilet.bound.h;
				} else {
					superParams.x = toilet.loc.x + canvasOffset - distFromWall;
					superParams.y = toilet.loc.y + canvasOffset - toilet.bound.h;
				}
				break;
			case 270:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + canvasOffset;
					superParams.y = toilet.loc.y + canvasOffset - toilet.bound.w + distFromWall;																																				
				} else {
					superParams.x = toilet.loc.x + canvasOffset;
					superParams.y = toilet.loc.y + canvasOffset - distFromWall;																																				
				}
				break;
		}
		

		if (rotation === 0 || rotation === 180) {
			superParams.w = toilet.bound.w; // BUGBUG: Will need to update to coordinate with other crap
			superParams.h = toilet.bound.h;
		} else {
			superParams.w = toilet.bound.h; // BUGBUG: Will need to update to coordinate with other crap
			superParams.h = toilet.bound.w;
		}

		super(superParams);
		
		this.toilet      = params.room.toilet;
		this.lineWidth   = 2;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
	/*
		Overwrites Shape draw function
	*/
	draw(ctx) {
		ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.fillRect(this.toilet.loc.x + 61, this.toilet.loc.y + 61, 5, 5);
		ctx.closePath();
		
		ctx.beginPath();
		console.log("Custom toilet draw function");
		
			ctx.lineWidth   = this.lineWidth;
			ctx.strokeStyle = this.strokeStyle;
		    ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.stroke();

		ctx.closePath();
	}
}

export { Toilet };
