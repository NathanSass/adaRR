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

		this.findImageAndBoundary( params );
	}
	
	/*
		Calculates the fixture boundary and the location of the fixture image
		TODO Implement: Calculates boundary centered on the Fixture
	*/
	findImageAndBoundary (params) {
		alert('Need to implement');
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
