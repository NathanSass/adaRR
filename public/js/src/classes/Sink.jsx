import { Fixture } from "./Fixture.jsx";
"use strict";

class Sink extends Fixture {
	constructor(params) {
		super(params);
	}

	/* Overrides default */
	findImageAndBoundary(params) {
		
		this.fixtureObj = {
			bound: {
				h: 60,
				w: 80
			},
			depth: 70, //not sure about this
			width: 58,
			loc: {
				distFromWall: 45,
				x: 300,
				y: 45
			}
		}
		var fixtureObj   = this.fixtureObj;

		var fixtureImg   = this.fixtureImg;
		var canvasOffset = this.canvasOffset;
		
		var rotation     = params.room.rotation;
		// var distFromWall = params.room[this.name].loc.distFromWall;
		// var distFromWall = params.room['toilet'].loc.distFromWall;
		var distFromWall = fixtureObj.loc.distFromWall;
		
		this.x = fixtureObj.loc.x + canvasOffset;
		this.y = fixtureObj.loc.y + canvasOffset;
		
		/*
			Takes the fixture width & height.
			Translates the orientation to match the rotation.
			Selects the proper image and builds its proper location
		*/
		switch ( rotation ) {
			case 0:
				/*
					Places the bounding rectangle in the proper spot depending if the fixture is left or right justified
				*/
				if (this.note.indexOf('1') >= 0) {
					this.x += - distFromWall;
				} else {
					this.x += - fixtureObj.bound.w + distFromWall;
				}
				/*
					Places the image so it is visually centered with the loc coordinates
					The number coordinates to image naming standards
				*/
				fixtureImg.img = document.getElementById( this.name + 1);
				fixtureImg.x   = fixtureObj.loc.x +  fixtureImg.img.width / 2;
				fixtureImg.y   = fixtureObj.loc.y +  fixtureImg.img.height;
				break;
			case 90:
				if (this.note.indexOf('1') >= 0) {
					this.x += - fixtureObj.bound.h;
					this.y += - distFromWall;																																				
				} else {
					this.x += - fixtureObj.bound.h;
					this.y += - fixtureObj.bound.w + distFromWall;																																				
				}
				
				fixtureImg.img = document.getElementById( this.name + 2);
				fixtureImg.x   = fixtureObj.loc.x;
				fixtureImg.y   = fixtureObj.loc.y + fixtureImg.img.height / 2;
				break;
			case 180:
				if (this.note.indexOf('1') >= 0) {
					this.x += - fixtureObj.bound.w + distFromWall;
					this.y += - fixtureObj.bound.h;
				} else {
					this.x += - distFromWall;
					this.y += - fixtureObj.bound.h;
				}
				
				fixtureImg.img = document.getElementById( this.name + 3);
				fixtureImg.x   = fixtureObj.loc.x + fixtureImg.img.width / 2;
				fixtureImg.y   = fixtureObj.loc.y;
				break;
			case 270:
				if (this.note.indexOf('1') >= 0) {
					this.y += -fixtureObj.bound.w + distFromWall;																																				
				} else {
					this.y -= distFromWall;																																				
				}
				
				fixtureImg.img = document.getElementById( this.name + 4);
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
}

export { Sink };