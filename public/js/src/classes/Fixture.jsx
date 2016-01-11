import { Shape } from "./Shape.jsx";
"use strict";

class Toilet extends Shape {
	constructor(params) {
		var superParams = {
			x: params.toilet.loc.x + 61,
			y: params.toilet.loc.y + 61,
			w: params.toilet.depth,
			h: params.toilet.width
		};


		switch (params.rotation) {
			case (90 || 270):
				superParams.w = params.toilet.width;
				superParams.h = params.toilet.depth;
				break;
			case 90:
				console.log('90')
				break;
			default:
				console.log('default');
				break

		}



		// if (params.rotation === 90 || params.rotation === 270) {
				
		// }

		super(superParams);
		
		this.fillStyle   = 'transparent';
		this.lineWidth   = 2;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
}

export { Toilet };
