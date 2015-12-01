var ctx, canvas, image, toiletWidth, toiletDepth, ROOM, canvasOffset;

canvasOffset = ftToCm(2);

var domReady = function(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

ROOM = {
	// topLeft    : { x: 2, y: 2 },
	// topRight   : { x: 12, y: 2 },
	// bottomLeft : { x: 2, y: 12 },
	// bottomRight: { x: 12, y: 12 }, // These are max values
	topLeft    : { x: 0, y: 0 },
	topRight   : { x: ftToCm(10), y: 0 },
	bottomLeft : { x: 0, y: ftToCm(10) },
	bottomRight: { x: ftToCm(10), y: ftToCm(10) }, // These are max values
	door       : {
		pos1: { x: ftToCm(0.4), y: 0 },
		pos2: { x: ftToCm(3.1), y: 0 }
	}
};

toiletDepth = inchToCm(28);
toiletWidth = inchToCm(23);

domReady(function() {
	
	buildCanvas({
		id: 'firstCanvas',
		width: 1000,
		height: 1000,
	});

	image     = document.createElement("img");
	image.src = "img/toilet_top_vert.png";

	
	image.onload = function() {
		
		drawRoom();
		drawDoor();

		// place fixture on all surface
		drawRotated({ rotation: 0, x: ftToCm(5), y: 0 });
		drawRotated({ rotation: 90, x: ftToCm(10), y: ftToCm(5) });
		drawRotated({ rotation: 180, x: ftToCm(5), y: ftToCm(10) });
		drawRotated({ rotation: 270, x: 0, y: ftToCm(5) });

	};
	return;
});

/*
	Adds a new Canvas to the DOM
*/
function buildCanvas(params) {
	var container = document.getElementById('canvasContainer');
	
	canvas    = document.createElement('canvas');
	canvas.id = params.id;
	canvas.width  = params.width;
	canvas.height = params.height;
	canvas.style.background = '#FDFDFD';
	
	ctx = canvas.getContext("2d");

	container.appendChild(canvas);
	return;
}

/*
	Given a degree of rotation and coordinate
	Rotates a fixture and places it on the coordinate
*/
function drawRotated (params) {
	var _x, _y; // for rotating the canvas and reseting the origin
	var rotation = params.rotation;

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(rotation * Math.PI/180);

  var halfHeight = canvas.height / 2;
  var halfWidth  = canvas.width / 2;
	
	if ( rotation === 0 || rotation === 360 ) {
		_x = - halfWidth;
		_y = - halfHeight;
  }
  if ( rotation === 90 ) {
		_x = - halfWidth;
		_y =   halfHeight - toiletDepth;
  }
  if ( rotation === 180 ) {
		_x =   halfWidth  - toiletWidth;
		_y =   halfHeight - toiletDepth;
  }
  if ( rotation === 270 ) {
		_x =   halfWidth - toiletWidth;
		_y = - halfHeight;
  }
	
	ctx.translate(_x, _y); // Moves the origin back to the top left
	
	var fixtureCoord = findEquivalentCoordinate({
		rotation: rotation,
		'x': params.x,
		'y': params.y
	});

	ctx.drawImage( image, fixtureCoord.x, fixtureCoord.y, toiletWidth, toiletDepth );
	
	ctx.restore();
	
	drawText( { txt: 'toilet', x: params.x, y: params.y } );
  return;
}

/*
	Given a word and coordinate
	Draws text
*/
function drawText(params) {
	ctx.beginPath();
	ctx.fillStyle    = 'black';
	ctx.font         = '10pt sans-serif';
	ctx.textAlign    = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText( params.txt, params.x, params.y );
	ctx.closePath();
}

/*
	Given a degree of rotation
	Finds the equivalent x,y coordinate pair in Ft
*/
function findEquivalentCoordinate (params) {
	var rotation = params.rotation;

	var maxX = ROOM.bottomRight.x;
	var maxY = ROOM.bottomRight.y;
	
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
}

/*
	Draws a room in the form of a rectangle
*/
function drawRoom () {
	ctx.beginPath();

	ctx.rect( ROOM.topLeft.x, ROOM.topLeft.y,
		ROOM.bottomRight.x, ROOM.bottomRight.y );
	ctx.lineWidth   = inchToCm(2);
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
	ctx.lineWidth   = inchToCm(2);
	ctx.strokeStyle = "white";
	// ctx.strokeStyle = "red";

	ctx.stroke();
	
	ctx.closePath();
	return;
}

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