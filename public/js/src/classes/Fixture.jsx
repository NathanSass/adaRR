import { Shape } from "./Shape.jsx";
"use strict";

class Fixture extends Shape {
	constructor(params) {

		var defaultParams = {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};

		super( defaultParams );

		/* Variables for drawing */
		this.lineWidth    = 2;
		this.isDraggable  = false;
		this.strokeStyle  = '#979797';
		
		/* These variables will be overwritting in findImageAndBoundary */
		this.name         = this.constructor.name.toLowerCase(); //used for image retrieval & naming		
		this.note         = params.room.note;
		this.fixtureObj   = params.room[this.name];
		this.fixtureImg   = {};
		this.canvasOffset = params.canvasOffset;
		this.orientation  = null;
		
		this.findImageAndBoundary( params );
	}
	/*
		Calculates the fixture boundary and the location of the fixture image
	*/

	findImageAndBoundary (params) {
		var name         = this.name;
		var note         = this.note;
		var fixtureObj   = this.fixtureObj;
		var fixtureImg   = this.fixtureImg;
		var orientation  = this.orientation;
		var canvasOffset = this.canvasOffset;
		
		var rotation     = params.room.rotation;
		var distFromWall = params.room[name].loc.distFromWall;
		
		this.x = fixtureObj.loc.x + canvasOffset;
		this.y = fixtureObj.loc.y + canvasOffset;
		
		/*
			Takes the toilet width & height.
			Translates the orientation to match the rotation.
			Selects the proper image and builds its proper location
		*/
		switch ( rotation ) {
			case 0:
				/*
					Places the bounding rectangle in the proper spot depending if the fixture is left or right justified
				*/
				if (note.indexOf('1') >= 0) {
					this.x += - distFromWall;
				} else {
					this.x += - fixtureObj.bound.w + distFromWall;
				}
				/*
					Places the image so it is visually centered with the loc coordinates
				*/
				orientation    = 1;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x +  fixtureImg.img.width / 2;
				fixtureImg.y   = fixtureObj.loc.y +  fixtureImg.img.height;
				break;
			case 90:
				if (note.indexOf('1') >= 0) {
					this.x += - fixtureObj.bound.h;
					this.y += - distFromWall;																																				
				} else {
					this.x += - fixtureObj.bound.h;
					this.y += - fixtureObj.bound.w + distFromWall;																																				
				}
				
				orientation   = 2;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x;
				fixtureImg.y   = fixtureObj.loc.y + fixtureImg.img.height / 2;
				break;
			case 180:
				if (note.indexOf('1') >= 0) {
					this.x += - fixtureObj.bound.w + distFromWall;
					this.y += - fixtureObj.bound.h;
				} else {
					this.x += - distFromWall;
					this.y += - fixtureObj.bound.h;
				}
				
				orientation = 3;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x + fixtureImg.img.width / 2;
				fixtureImg.y   = fixtureObj.loc.y;
				break;
			case 270:
				if (note.indexOf('1') >= 0) {
					this.y += -fixtureObj.bound.w + distFromWall;																																				
				} else {
					this.y -= distFromWall;																																				
				}
				
				orientation = 4;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x + fixtureImg.img.height;
				fixtureImg.y   = fixtureObj.loc.y + fixtureImg.img.width / 2;
				break;
		}
		

		if ( rotation === 0 || rotation === 180 ) {
			this.w = fixtureObj.bound.w;
			this.h = fixtureObj.bound.h;
		} else {
			this.w = fixtureObj.bound.h;
			this.h = fixtureObj.bound.w;
		}

	}
	
	/*
		Overwrites Shape draw function
		Draws a fixture image, a dot to grab the fixture, and boundary for the fixture
	*/
	draw(ctx) {
		
		ctx.drawImage( this.fixtureImg.img, // draws image
			this.fixtureImg.x,
			this.fixtureImg.y
		);
		
		ctx.beginPath(); // Draws bounding rectangle
		
			ctx.lineWidth   = this.lineWidth;
			ctx.strokeStyle = this.strokeStyle;
		    ctx.strokeRect(this.x, this.y, this.w, this.h);
			ctx.stroke();

		ctx.closePath();
		
		ctx.beginPath(); // Draws Dot
	      
	      ctx.arc(this.fixtureObj.loc.x + 61,this.fixtureObj.loc.y + 61, 7, 0, 2 * Math.PI, false);
	      ctx.fillStyle = '#39CCCC';
	      ctx.fill();
		
		ctx.closePath();
	}
}

export { Fixture };
