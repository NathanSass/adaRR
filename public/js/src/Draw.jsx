(function() {
	var exports = module.exports;
	
	var ROOM, ctx, canvasOffset;
	
	exports.draw = function(data) {
		// console.log('$$$$$$$$$$$$$$');
		initializeVars(data);

		drawRoom();
	},

	initializeVars = function(data) {

		ctx = data.ctx;
		canvasOffset = data.canvasOffset;
		
		ROOM        = {};
		ROOM.id     = data.id;
		ROOM.width  = data.width;
		ROOM.height = data.height;
		ROOM.door   = data.door;
	},

	/*
		Draws a room in the form of a rectangle
	*/
	drawRoom = function() {
		// var ctx = this.ctx;

		ctx.beginPath();

		ctx.rect( canvasOffset, canvasOffset,
		ROOM.width, ROOM.height );
		ctx.lineWidth   = inchToCm(2);
		ctx.fillStyle   = '#F5F5F5';
		ctx.strokeStyle = '#5A5A5A';
		ctx.stroke();
		ctx.closePath();
		return;
	},

	inchToCm = function(inches) {
		return inches * 2.54;
	}
}());