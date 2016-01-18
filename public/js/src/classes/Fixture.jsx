import { Shape } from "./Shape.jsx";
"use strict";

class Fixture extends Shape {
	constructor(params) {
		var name         = params.name; //used for image retrieval & naming
		
		var fixtureObj   = params.room[name];
		var fixtureImg   = {};

		var note         = params.room.note;
		var rotation     = params.room.rotation;
		
		var wallWidth    = 10;
		var orientation  = null;
		var canvasOffset = params.canvasOffset;
		var distFromWall = params.room[name].loc.distFromWall;

		
		var superParams  = {
				x: fixtureObj.loc.x + canvasOffset,
				y: fixtureObj.loc.y + canvasOffset
			};

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
					superParams.x += - distFromWall;
				} else {
					superParams.x += - fixtureObj.bound.w + distFromWall;
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
					superParams.x += - fixtureObj.bound.h;
					superParams.y += - distFromWall;																																				
				} else {
					superParams.x += - fixtureObj.bound.h;
					superParams.y += - fixtureObj.bound.w + distFromWall;																																				
				}
				
				orientation   = 2;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x;
				fixtureImg.y   = fixtureObj.loc.y + fixtureImg.img.height / 2;
				break;
			case 180:
				if (note.indexOf('1') >= 0) {
					superParams.x += - fixtureObj.bound.w + distFromWall;
					superParams.y += - fixtureObj.bound.h;
				} else {
					superParams.x += - distFromWall;
					superParams.y += - fixtureObj.bound.h;
				}
				
				orientation = 3;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x + fixtureImg.img.width / 2;
				fixtureImg.y   = fixtureObj.loc.y;
				break;
			case 270:
				if (note.indexOf('1') >= 0) {
					superParams.y += -fixtureObj.bound.w + distFromWall;																																				
				} else {
					superParams.y -= distFromWall;																																				
				}
				
				orientation = 4;
				fixtureImg.img = document.getElementById( name + orientation);
				fixtureImg.x   = fixtureObj.loc.x + fixtureImg.img.height;
				fixtureImg.y   = fixtureObj.loc.y + fixtureImg.img.width / 2;
				break;
		}
		

		if ( rotation === 0 || rotation === 180 ) {
			superParams.w = fixtureObj.bound.w;
			superParams.h = fixtureObj.bound.h;
		} else {
			superParams.w = fixtureObj.bound.h;
			superParams.h = fixtureObj.bound.w;
		}

		super( superParams );
		
		this.name             = name;
		this.fixtureObj       = params.room[name];
		this.lineWidth        = 2;
		this.isDraggable      = false;
		this.strokeStyle      = '#979797';
		this.orientation      = orientation;
		this.canvasOffset     = canvasOffset;
		this.fixtureImg = fixtureImg;
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
