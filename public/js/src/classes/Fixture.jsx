import { Shape } from "./Shape.jsx";
"use strict";

class Toilet extends Shape {
	constructor(params) {
		var note         = params.room.note,
			toilet       = params.room.toilet,
			rotation     = params.room.rotation,
			wallWidth    = 10,
			orientation  = null,
			canvasOffset = params.canvasOffset,
			distFromWall = params.room.toilet.loc.distFromWall,
		
			superParams  = {
				x: toilet.loc.x + canvasOffset,
				y: toilet.loc.y + canvasOffset
			};

		// /*
		// 	Takes the toilet width & height.
		// 	Translates the orientation to match the rotation.
		// */
		switch ( rotation ) {
			case 0:
				if (note.indexOf('1') >= 0) {
					superParams.x += - distFromWall;
				} else {
					superParams.x += - toilet.bound.w + distFromWall;
				}
				orientation = 1;
				break;
			case 90:
				if (note.indexOf('1') >= 0) {
					superParams.x += - toilet.bound.h;
					superParams.y += - distFromWall;																																				
				} else {
					superParams.x += - toilet.bound.h;
					superParams.y += - toilet.bound.w + distFromWall;																																				
				}
				orientation = 2;
				break;
			case 180:
				if (note.indexOf('1') >= 0) {
					superParams.x += - toilet.bound.w + distFromWall;
					superParams.y += - toilet.bound.h;
				} else {
					superParams.x += - distFromWall;
					superParams.y += - toilet.bound.h;
				}
				orientation = 3;
				break;
			case 270:
				if (note.indexOf('1') >= 0) {
					superParams.y += -toilet.bound.w + distFromWall;																																				
				} else {
					superParams.y -= distFromWall;																																				
				}
				orientation = 4;
				break;
		}
		

		if ( rotation === 0 || rotation === 180 ) {
			superParams.w = toilet.bound.w;
			superParams.h = toilet.bound.h;
		} else {
			superParams.w = toilet.bound.h;
			superParams.h = toilet.bound.w;
		}

		super( superParams );
		
		this.toilet       = params.room.toilet;
		this.lineWidth    = 2;
		this.isDraggable  = false;
		this.strokeStyle  = '#979797';
		this.orientation  = orientation;
		this.canvasOffset = canvasOffset;
	}
	/*
		Overwrites Shape draw function
	*/
	draw(ctx) {
		ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.fillRect(this.toilet.loc.x + 61, this.toilet.loc.y + 61, 5, 5);
		ctx.closePath();
		
		var toiletImg = document.getElementById("toilet" + this.orientation);
		ctx.drawImage( toiletImg,
			this.toilet.loc.x + this.canvasOffset - toiletImg.height,
			this.toilet.loc.y + this.canvasOffset - toiletImg.width / 2
		);

		
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
