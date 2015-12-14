(function() {
	
	var exports = module.exports;

	var Util = require('./DrawingUtil.jsx');
	
	/////////// CONSTANTS AND GLOBALS /////////

	var ctx, toiletImg, TOILET, ROOM, CANVAS;

	///////////////////////////////////////////
	
	exports.draw = function(data) {
		createDomResources();

		toiletImg.onload = function() {
			init(data);

			drawRoom();
			drawDoor();

			placeFixtureOnCenterOfAllSurfaces();
		};
	};

	function init(data) {

		ctx = data.ctx;
		
		ROOM = {};
		ROOM.id     = data.id;
		ROOM.width  = data.maxX;
		ROOM.height = data.maxY;
		ROOM.door   = data.door;

		CANVAS = {};
		CANVAS.offset = data.canvasOffset;
		CANVAS.size   = data.canvasSize;

		TOILET = {};
		TOILET.depth = Util.inchToCm(28);
		TOILET.width =  Util.inchToCm(23);
	}

	/*
		Draws a room in the form of a rectangle
	*/
	function drawRoom() {
		ctx.beginPath();

		ctx.rect( CANVAS.offset, CANVAS.offset,
		ROOM.width, ROOM.height );
		ctx.lineWidth   = Util.inchToCm(2);
		ctx.fillStyle   = '#F5F5F5';
		ctx.strokeStyle = '#5A5A5A';
		ctx.stroke();
		ctx.closePath();
		return;
	}
	
	/*
		Draws a door
	*/
	function drawDoor() {
		ctx.beginPath();

		ctx.moveTo( ROOM.door.pos1.x, ROOM.door.pos1.y );
		ctx.lineTo( ROOM.door.pos2.x, ROOM.door.pos2.y );
		ctx.lineWidth   = Util.inchToCm(2);
		ctx.strokeStyle = "white";

		ctx.stroke();

		ctx.closePath();
		return;
	}

	/*
		creates the necessary resources that will be maniuplated on the dom
	*/
	function createDomResources() {
		toiletImg     = document.createElement("img");
		toiletImg.src = "public/img/toilet_top_vert.png";
	}

	//////////////////////////
	//////// Testing Functions
	//////////////////////////

	function placeFixtureOnCenterOfAllSurfaces() {
		var fixtureData = TOILET;
		
		Util.drawRotated({ rotation: 0,   x: ROOM.width/2, y: 0,             fixture: fixtureData, canvas: CANVAS, ctx: ctx, image: toiletImg });
		Util.drawRotated({ rotation: 90,  x: ROOM.width,   y: ROOM.height/2, fixture: fixtureData, canvas: CANVAS, ctx: ctx, image: toiletImg, txt: 'XXXXX xxxxxxxx'});
		Util.drawRotated({ rotation: 180, x: ROOM.width/2, y: ROOM.height,   fixture: fixtureData, canvas: CANVAS, ctx: ctx, image: toiletImg, txt: 'toilet'});
		Util.drawRotated({ rotation: 270, x: 0,            y: ROOM.height/2, fixture: fixtureData, canvas: CANVAS, ctx: ctx, image: toiletImg, txt: 'toilet'});

	}
	
}());