(function() {
	var exports = module.exports;

	exports.domReady = function(callback) {
		document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
	};

	exports.inchToCm = function(inches) {
		return inches * 2.54;
	};

	exports.cmToFt = function(cm) {
		return cm / 30.48;
	};

	exports.ftToCm = function(foot) {
		return foot * 30.48;
	};


	/*
		Given a degree of rotation and coordinate
		Rotates a fixture and places it on the coordinate

		Main Function - uses findEquivalentCoordinate & drawText
	*/
	exports.drawRotated  = function (params) {
		var _x, _y; // for rotating the canvas and reseting the origin
		var halfCanvas = params.canvas.size / 2;
		var rotation = params.rotation;
		var ctx = params.ctx;
		var canvas = params.canvas;
		// var canvasOffset = params.canvasOffset;
		var image = params.image;


		ctx.save();
		ctx.translate(halfCanvas, halfCanvas);
		ctx.rotate(rotation * Math.PI/180);

		if ( rotation === 0 || rotation === 360 ) {
			_x = _y = - halfCanvas + canvas.offset;
		}
		if ( rotation === 90 ) {
			_x = - halfCanvas + canvas.offset;
			_y =   halfCanvas - params.fixture.depth - canvas.offset;
		}
		if ( rotation === 180 ) {
			_x =   halfCanvas - params.fixture.width - canvas.offset;
			_y =   halfCanvas - params.fixture.depth - canvas.offset;
		}
		if ( rotation === 270 ) {
			_x =   halfCanvas - params.fixture.width - canvas.offset;
			_y = - halfCanvas + canvas.offset;
		}

		ctx.translate(_x, _y); // Moves the origin back to the top left

		var fixtureCoord = this.findEquivalentCoordinate({
			rotation: rotation,
			'x': params.x,
			'y': params.y,
			fixtureDepth: params.fixture.depth,
			fixtureWidth: params.fixture.width
		});

		ctx.drawImage( image, fixtureCoord.x, fixtureCoord.y, params.fixture.width, params.fixture.width );

		ctx.restore();

		if ( params.hasOwnProperty('txt') ) {
			this.drawText( { txt: params.txt, x: params.x + canvas.offset, y: params.y + canvas.offset, ctx: ctx } );
		}
		return;
	};

	/*
		Given a degree of rotation
		Finds the equivalent x,y coordinate pair in Ft
	*/
	exports.findEquivalentCoordinate = function (params) {
		var rotation = params.rotation;

		var _x = params.x, // these are the disired coordinates
			_y = params.y;

		var fixtureDepth       = params.fixtureDepth;
		var fixtureCenterPoint = params.fixtureWidth / 2;
		
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
	};

	/*
		Given a word and coordinate
		Draws text
	*/
	exports.drawText = function(params) {
		var ctx = params.ctx;
		ctx.beginPath();
		ctx.fillStyle    = 'black';
		ctx.font         = '10pt sans-serif';
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText( params.txt, params.x, params.y );
		ctx.closePath();
	};

}());