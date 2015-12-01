var ctx, canvas, image, toiletWidth, toiletDepth;

var domReady = function(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


var ROOM = {
	// topLeft    : { x: 0.1, y: 0.1 },
	// topRight   : { x: 10.1, y: 0.1 },
	// bottomLeft : { x: 0.1, y: 10.1 },
	// bottomRight: { x: 10.1, y: 10.1 }, // These are max values
	topLeft    : { x: 0, y: 0 },
	topRight   : { x: 10, y: 0 },
	bottomLeft : { x: 0, y: 10 },
	bottomRight: { x: 10, y: 10 }, // These are max values
	door       : {
		pos1: { x: 0.6, y: 0.1 },
		pos2: { x: 3.6, y: 0.1 }
	}
};

domReady(function() {
	
	canvas = document.getElementById("mainCanvas");
	canvas.style.background = '#FDFDFD';
	ctx = canvas.getContext("2d");
	var angleInDegrees = 0;

	toiletDepth = inchToCm(28);
	toiletWidth = inchToCm(23);

	image     = document.createElement("img");
	image.src = "img/toilet_top_vert.png";

	
	image.onload = function() {
		
		drawRoom();
		drawDoor();
		
		// place fixture on all surface
		drawRotated({ rotation: 0, x: 5, y: 0 });
		drawRotated({ rotation: 90, x: 10, y: 5 });
		drawRotated({ rotation: 180, x: 5, y: 10 });
		drawRotated({ rotation: 270, x: 0, y: 5 });

	};
	return;
});

/*
	Given a degree of rotation and coordinate
	Rotates a fixture and places it on the coordinate
*/
function drawRotated (params) {
	var _x, _y; // for rotating the canvas and the reseting the origin
	var rotation = params.rotation;

  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(rotation * Math.PI/180);
	
	if ( rotation === 0 || rotation === 360 ) {
		_x = -canvas.width/2;
		_y = -canvas.height/2;
  }
  if ( rotation === 90 ) {
		_x = ( -canvas.width/ 2 ) ;
		_y = ( canvas.height/2 ) - toiletDepth;
  }
  if ( rotation === 180 ) {
		_x = ( canvas.width/ 2 ) - toiletWidth;
		_y = ( canvas.height/2 ) - toiletDepth;
  }
  if ( rotation === 270 ) {
		_x = ( canvas.width/ 2 ) - toiletWidth;
		_y = ( -canvas.height/2 );
  }
	
	ctx.translate(_x, _y); // Moves the origin back to the top left
	
	var fixtureCoord = findEquivalentCoordinate({
		rotation: rotation,
		'x': params.x,
		'y': params.y
	});

	ctx.drawImage(  image, ftToCm(fixtureCoord.x), ftToCm(fixtureCoord.y), toiletWidth, toiletDepth );
	
	ctx.restore();
  return;
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

	var fixtureDepth       = cmToFt(toiletDepth);
	var fixtureCenterPoint = cmToFt(toiletWidth) / 2;
	
	var x, y; // these are the adjusted coordinates

	if ( rotation === 0 || rotation === 360 ) {
		x = _x - fixtureCenterPoint;
		y = _y;
	}
	if ( rotation === 90 ) {
		x = _y - fixtureCenterPoint; // draws on center
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

	ctx.rect( ftToCm(ROOM.topLeft.x), ftToCm(ROOM.topLeft.y),
	ftToCm(ROOM.bottomRight.x), ftToCm(ROOM.bottomRight.y) );
	
	ctx.lineWidth = inchToCm(2);
	ctx.fillStyle = '#F5F5F5';
	ctx.fill();
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
	
	ctx.moveTo( ftToCm(ROOM.door.pos1.x), ftToCm(ROOM.door.pos1.y) );
	ctx.lineTo( ftToCm(ROOM.door.pos2.x), ftToCm(ROOM.door.pos2.y) );
	ctx.lineWidth = inchToCm(2);
	ctx.strokeStyle = "white";
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