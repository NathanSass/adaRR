(function() {
	var domReady = function(callback) {
		document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
	};
	
	var exports = module.exports;
	//////////////////////////
	//////// Helper Functions
	//////////////////////////

	function inchToCm(inches) {
		return inches * 2.54;
	}

	function cmToFt(cm) {
		return cm / 30.48;
	}

	function ftToCm(foot) {
		return foot * 30.48;
	}
	
	/////////// CONSTANTS AND GLOBALS ///////////

	var ctx, canvas, image, toiletWidth, toiletDepth, ROOM, canvasOffset, canvasSize;

	canvasOffset = ftToCm(2);
	toiletDepth  = inchToCm(28);
	toiletWidth  = inchToCm(23);

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
		canvasSize = data.canvasSize;
		
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
	
	/*
		Draws a door
	*/
	drawDoor = function() {
		ctx.beginPath();

		ctx.moveTo( ROOM.door.pos1.x, ROOM.door.pos1.y );
		ctx.lineTo( ROOM.door.pos2.x, ROOM.door.pos2.y );
		ctx.lineWidth   = inchToCm(2);
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
		var halfHeight = canvasSize / 2;
		var halfWidth  = canvasSize / 2;

		ctx.save();
		ctx.translate(canvasSize/2, canvasSize/2);
		ctx.rotate(rotation * Math.PI/180);

		if ( rotation === 0 || rotation === 360 ) {
			_x = - halfWidth  + canvasOffset;
			_y = - halfHeight + canvasOffset;
		}
		if ( rotation === 90 ) {
			_x = - halfWidth  + canvasOffset;
			_y =   halfHeight - toiletDepth - canvasOffset;
		}
		if ( rotation === 180 ) {
			_x =   halfWidth  - toiletWidth - canvasOffset;
			_y =   halfHeight - toiletDepth - canvasOffset;
		}
		if ( rotation === 270 ) {
			_x =   halfWidth  - toiletWidth - canvasOffset;
			_y = - halfHeight + canvasOffset;
		}

		ctx.translate(_x, _y); // Moves the origin back to the top left

		var fixtureCoord = findEquivalentCoordinate({
			rotation: rotation,
			'x': params.x,
			'y': params.y
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

	/*
		Given a degree of rotation
		Finds the equivalent x,y coordinate pair in Ft
	*/
	findEquivalentCoordinate = function (params) {
		var rotation = params.rotation;

		var _x = params.x, // these are the disired coordinates
				_y = params.y;

		var fixtureDepth       = toiletDepth;
		var fixtureCenterPoint = toiletWidth / 2;
		
		var x, y; // these are the adjusted coordinates

		if ( rotation === 0 || rotation === 360 ) {
			x = _x - fixtureCenterPoint;
			y = _y;
		}
		if ( rotation === 90 ) {
			x =   _y - fixtureCenterPoint; // draws on center
			y = - _x + fixtureDepth;
		}
		if ( rotation === 180 ) {
			x = -_x + fixtureCenterPoint;
			y = -_y + fixtureDepth;
		}
		if ( rotation === 270 ) {
			x = -_y + fixtureCenterPoint;
			y = _x;
		}

		return { 'x': x, 'y': y };
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