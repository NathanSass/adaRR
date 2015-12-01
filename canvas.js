var domReady = function(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

var ctx, canvas, image, toiletWidth, toiletDepth, ROOM, canvasOffset;

canvasOffset = ftToCm(2);
toiletDepth  = inchToCm(28);
toiletWidth  = inchToCm(23);

/////////// CONSTANTS AND GLOBALS ///////////

/*
	ignition function to build out the room
*/
function modelRoom (params) {
	populateRoomVariable(params);

	var canvasSize;
	ROOM.height >= ROOM.width ? canvasSize = ROOM.height : canvasSize = ROOM.width; // Ensures the canvas is square and large enough
	canvasSize  += canvasOffset * 2;

	buildCanvas({
		id: params.id,
		width:  canvasSize,
		height: canvasSize,
	});

	drawRoom();
	drawDoor();

	placeFixtureOnCenterOfAllSurfaces();

	return;
}

/*
	Called when the room is being made.
	This variable is used through out the process to dimension out the space.
*/
function populateRoomVariable (params) {
	ROOM = {
		id         : params.id,
		width      : ftToCm(params.maxX),
		height     : ftToCm(params.maxY),
		door       : {
			pos1: { x: ftToCm(params.door.pos1.x) + canvasOffset, y: ftToCm(params.door.pos1.y) + canvasOffset },
			pos2: { x: ftToCm(params.door.pos2.x) + canvasOffset, y: ftToCm(params.door.pos2.y) + canvasOffset }
		}
	};
}

/*
	Adds a new Canvas to the DOM
*/
function buildCanvas(params) {
	var container = document.getElementById('canvasContainer');
	
	canvas        = document.createElement('canvas');
	canvas.id     = params.id;
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
	var rotation   = params.rotation;
  var halfHeight = canvas.height / 2;
  var halfWidth  = canvas.width / 2;

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
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

	ctx.rect( canvasOffset, canvasOffset,
		ROOM.width, ROOM.height );
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

	ctx.stroke();
	
	ctx.closePath();
	return;
}
/*
	creates the necessary resources that will be maniuplated on the dom
*/
function createDomResources() {
	image     = document.createElement("img");
	image.src = "img/toilet_top_vert.png";
}

//////////////////////////
//////// Testing Functions
//////////////////////////

function placeFixtureOnCenterOfAllSurfaces() {
	drawRotated({ rotation: 0,   x: ROOM.width/2,  y: 0              });
	drawRotated({ rotation: 90,  x: ROOM.width,    y: ROOM.height/2  });
	drawRotated({ rotation: 180, x: ROOM.width/2,  y: ROOM.height    });
	drawRotated({ rotation: 270, x: 0,             y: ROOM.height/2  });
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

//////////////////////////
//////// ENTRY POINT
//////////////////////////

domReady(function() {
	
	createDomResources();
	
	image.onload = function() {
		
		modelRoom({
			id: 'firstCanvas',
			maxX: 10,
			maxY: 10,
			door: {
				pos1: { x: 0.4, y: 0 },
				pos2: { x: 3.1, y: 0 }
			}
		});

		modelRoom({
			id: 'secondCanvas',
			maxX: 11,
			maxY: 11,
			door: {
				pos1: { x: 0.4, y: 0 },
				pos2: { x: 3.1, y: 0 }
			}
		});

		modelRoom({
			id: 'thirdCanvas',
			maxX: 3,
			maxY: 11,
			door: {
				pos1: { x: 0.4, y: 0 },
				pos2: { x: 3.1, y: 0 }
			}
		});

		modelRoom({
			id: 'fourthCanvas',
			maxX: 11,
			maxY: 3,
			door: {
				pos1: { x: 0.4, y: 0 },
				pos2: { x: 3.1, y: 0 }
			}
		});
	
	};
	
	return;
});