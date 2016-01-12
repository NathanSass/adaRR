import { Shape } from "./Shape.jsx";
"use strict";

class Toilet extends Shape {
	constructor(params) {
		var note         = params.room.note,
			toilet       = params.room.toilet,
			rotation     = params.room.rotation,
			wallWidth    = 10,
			canvasOffset = params.canvasOffset,
			distFromWall = 45.72, //TODO: update mock data then use data
		
			superParams  = {};


		switch ( rotation ) {
			case 0:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + (distFromWall / 2) - wallWidth;
				} else {
					superParams.x = toilet.loc.x + canvasOffset - (distFromWall / 2);
				}
				superParams.y = toilet.loc.y + canvasOffset;
				break;
			
			case 180:
				if (note.indexOf('1') >= 0) {
					superParams.x = toilet.loc.x + canvasOffset - distFromWall / 2;
				} else {
					superParams.x = toilet.loc.x + (distFromWall / 2) - wallWidth;
				}
				superParams.y = toilet.loc.y + canvasOffset - toilet.width;
				break;
			
			case 90:
				if (note.indexOf('1') >= 0) {
					superParams.y = toilet.loc.y + canvasOffset - distFromWall;
				} else {
					superParams.y = toilet.loc.y + canvasOffset - (distFromWall / 2);
				}
				superParams.x = toilet.loc.x + canvasOffset - toilet.width;
				break;
			
			case 270:
				superParams.x = toilet.loc.x + canvasOffset;
				if (note.indexOf('1') >= 0) {
					superParams.y = toilet.loc.y + canvasOffset - (distFromWall / 2);
				} else {
					superParams.y = toilet.loc.y + (distFromWall / 2) - wallWidth;					
				}
				break;
			
			default:
				break;
		}
		
		if (rotation === 0 || rotation === 180) { // For Vert or Horiz toilet orientation
				superParams.w = toilet.depth;
				superParams.h = toilet.width;

		} else {
				superParams.w = toilet.width;
				superParams.h = toilet.depth;
		
		}

		super(superParams);
		
		this.fillStyle   = 'transparent';
		this.lineWidth   = 2;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
}

export { Toilet };
