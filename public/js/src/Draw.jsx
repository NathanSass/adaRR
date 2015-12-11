(function() {
	
	var exports = module.exports;

	var Util = require('./DrawingUtil.jsx');
	
	/////////// CONSTANTS AND GLOBALS ///////////

	var ctx, canvas, image, toiletWidth, toiletDepth, ROOM, canvasOffset, canvasSize;

	canvasOffset = Util.ftToCm(2);
	toiletDepth  = Util.inchToCm(28);
	toiletWidth  = Util.inchToCm(23);

	///////////////////////////////////////////
	
	exports.draw = function(data) {
		createDomResources();

		image.onload = function() {
			init(data);

			drawRoom();
			drawDoor();

			placeFixtureOnCenterOfAllSurfaces();
		}
	},

	init = function(data) {

		ctx = data.ctx;
		canvasOffset = data.canvasOffset;
		canvasSize   = data.canvasSize;
		
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
		ctx.lineWidth   = Util.inchToCm(2);
		ctx.fillStyle   = '#F5F5F5';
		ctx.strokeStyle = '#5A5A5A';
		ctx.stroke();
		ctx.closePath();
		return;
	},
	
	/*
		Draws a door
	*/
	drawDoor = function() {
		ctx.beginPath();

		ctx.moveTo( ROOM.door.pos1.x, ROOM.door.pos1.y );
		ctx.lineTo( ROOM.door.pos2.x, ROOM.door.pos2.y );
		ctx.lineWidth   = Util.inchToCm(2);
		ctx.strokeStyle = "white";

		ctx.stroke();

		ctx.closePath();
		return;
	},

	/*
		creates the necessary resources that will be maniuplated on the dom
	*/
	createDomResources = function () {
		image     = document.createElement("img");
		image.src = "public/img/toilet_top_vert.png";
	},

	/*
		Given a degree of rotation and coordinate
		Rotates a fixture and places it on the coordinate
	*/
	drawRotated  = function (params) {
		var _x, _y; // for rotating the canvas and reseting the origin
		var rotation   = params.rotation;
		var halfCanvas = canvasSize / 2;

		ctx.save();
		ctx.translate(halfCanvas, halfCanvas);
		ctx.rotate(rotation * Math.PI/180);

		if ( rotation === 0 || rotation === 360 ) {
			_x = _y = - halfCanvas + canvasOffset;
		}
		if ( rotation === 90 ) {
			_x = - halfCanvas + canvasOffset;
			_y =   halfCanvas - toiletDepth - canvasOffset;
		}
		if ( rotation === 180 ) {
			_x =   halfCanvas - toiletWidth - canvasOffset;
			_y =   halfCanvas - toiletDepth - canvasOffset;
		}
		if ( rotation === 270 ) {
			_x =   halfCanvas - toiletWidth - canvasOffset;
			_y = - halfCanvas + canvasOffset;
		}

		ctx.translate(_x, _y); // Moves the origin back to the top left

		var fixtureCoord = Util.findEquivalentCoordinate({
			rotation: rotation,
			'x': params.x,
			'y': params.y,
			fixtureDepth: toiletDepth,
			fixtureWidth: toiletWidth
		});

		ctx.drawImage( image, fixtureCoord.x, fixtureCoord.y, toiletWidth, toiletDepth );

		ctx.restore();

		drawText( { txt: 'toilet', x: params.x + canvasOffset, y: params.y + canvasOffset } );
		return;
	},

	/*
		Given a word and coordinate
		Draws text
	*/
	drawText = function(params) {
		ctx.beginPath();
		ctx.fillStyle    = 'black';
		ctx.font         = '10pt sans-serif';
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText( params.txt, params.x, params.y );
		ctx.closePath();
	},

	//////////////////////////
	//////// Testing Functions
	//////////////////////////

	placeFixtureOnCenterOfAllSurfaces = function() {
		drawRotated({ rotation: 0,   x: ROOM.width/2,  y: 0              });
		drawRotated({ rotation: 90,  x: ROOM.width,    y: ROOM.height/2  });
		drawRotated({ rotation: 180, x: ROOM.width/2,  y: ROOM.height    });
		drawRotated({ rotation: 270, x: 0,             y: ROOM.height/2  });
	}
	
}());