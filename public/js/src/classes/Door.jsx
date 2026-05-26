import {Shape} from "./Shape.jsx";
"use strict";

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

export { Door };
