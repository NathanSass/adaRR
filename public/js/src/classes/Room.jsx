import {Shape} from "./Shape.jsx";
"use strict";

class Room extends Shape {
	constructor(params) {
		super(params);
		
		this.fillStyle   = '#F5F5F5';
		this.lineWidth   = 10;
		this.strokeStyle = '#979797';
		this.isDraggable = false;
	}
}

export { Room };
