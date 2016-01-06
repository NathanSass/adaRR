(function() {
	
	var exports = module.exports;

	var Util = require('./DrawingUtil.jsx');
	
	/////////// CONSTANTS AND GLOBALS /////////

	var ctx, toiletImg, TOILET, ROOM, CANVAS;

	///////////////////////////////////////////
	
	exports.draw = function(data) {
		createDomResources();


		toiletImg.onload = function() {
			buildCanvas(data.room);
			
			init(data.room);

			drawRoom();
			
			drawDoor();

			drawToilet();
		};
	};

	function buildCanvas(data) {
		var container = document.getElementById('roomsWithToilets');
		var canvas    = document.createElement('canvas');
		var link      = document.createElement('a');

		link.className = 'roomWithToilet-link';
		link.href      = 'javascript:void(0);';
		
		ctx    = canvas.getContext("2d");

		canvas.id     = data.id;
		canvas.width  = data.canvasSize;
		canvas.height = data.canvasSize;

		link.appendChild(canvas);
		container.appendChild(link);
	}

	function init(data) {

		ROOM = {};
		ROOM.id       = data.id;
		ROOM.width    = data.maxX;
		ROOM.height   = data.maxY;
		ROOM.door     = data.door;
		ROOM.rotation = data.rotation;

		CANVAS = {};
		CANVAS.offset = data.canvasOffset;
		CANVAS.size   = data.canvasSize;

		TOILET = {};
		TOILET.depth  = data.toilet.depth;
		TOILET.width  = data.toilet.width;
		TOILET.loc    = data.toilet.loc;
	}

	/*
		Draws a room in the form of a rectangle
	*/
	function drawRoom() {
		ctx.beginPath();

		ctx.rect( CANVAS.offset, CANVAS.offset,
		ROOM.width, ROOM.height );
		// ctx.lineWidth   = Util.inchToCm(2);
		ctx.lineWidth   = 12;
		ctx.fillStyle   = '#F5F5F5';
		ctx.strokeStyle = '#979797';
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
		// ctx.lineWidth   = Util.inchToCm(2);
		ctx.lineWidth   = 12;
		ctx.strokeStyle = "#D8D8D8";

		ctx.stroke();

		ctx.closePath();
		return;
	}

	/*
		Draws a toilet
	*/
	function drawToilet() {
		var fixtureData = TOILET;
		
		Util.drawRotated({ rotation: ROOM.rotation,  x: TOILET.loc.x,   y: TOILET.loc.y, fixture: fixtureData, canvas: CANVAS, ctx: ctx, image: toiletImg, txt: ''}); // text was toilet but decided that didn't need it
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