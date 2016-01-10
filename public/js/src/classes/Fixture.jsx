import { Shape } from "./Shape.jsx";
"use strict";

class Toilet extends Shape {
	constructor(params) {
		var superParams = {
			x: params.toilet.loc.x,
			y: params.toilet.loc.y,
			w: params.toilet.depth,
			h: params.toilet.width
		};

		if (params.rotation === 90 || params.rotation === 270) {
			superParams.w = params.toilet.width;
			superParams.h = params.toilet.depth;
				
		}

		super(superParams);
		
		this.fillStyle   = 'transparent';
		this.lineWidth   = 2;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
}

export { Toilet };
