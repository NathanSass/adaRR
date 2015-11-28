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

	toiletDepth = inchToCm(35);
	toiletWidth = inchToCm(25);
	
	image     = document.createElement("img");
	image.src = "img/toilet_top_vert.png";

	
	image.onload = function(){
		drawRoom();
		drawDoor();
		
		// findEquivalentCoordinate({ rotation: 270, x: 7, y: 1 });
		ctx.drawImage(image, ftToCm(7), ftToCm(1), toiletWidth, toiletDepth);
		// ctx.drawImage(image, ftToCm(ROOM.topRight.x) - toiletWidth, ftToCm(ROOM.topLeft.y), toiletWidth, toiletDepth);

		// drawRotated({ rotation: 0, x: 7, y: 1 }); 
		drawRotated({ rotation: 90, x: 7, y: 1 });
		// drawRotated({ rotation: 180, x: 7, y: 1 });
		// drawRotated({ rotation: 270, x: 7, y: 1 });

	};
	return;
});

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
	
	ctx.translate(_x, _y); // Moves the drawing spot back to a new crafted origin [0,0]
	
	var fixtureCoord = findEquivalentCoordinate({
		rotation: rotation,
		'x': params.x,
		'y': params.y
	});

	ctx.drawImage( image, 30, -190, toiletWidth, toiletDepth );
	ctx.restore();
  return;
}

/*
	Given a degree of rotation
	Finds the equivalent x,y coordinate pair in Ft
	* must be inside the room
*/
	
function findEquivalentCoordinate (params) {
	var rotation = params.rotation;

	var maxX = ROOM.bottomRight.x;
	var maxY = ROOM.bottomRight.y;
	var _x = params.x, // these are the disired coordinates
			_y = params.y;
	
	var x, y; // these are the adjusted coordinates

	if ( rotation === 0 || rotation === 360 ) { x = _x; y = _y; }
	if ( rotation === 90 ) {
		x = maxX - ( maxX - _y );
		y = maxY - _x;
	}
	if ( rotation === 180 ) {
		x = _y;
		y = maxY - _y;
	}
	if ( rotation === 270 ) {
		x = maxX - _y;
		y = _x;
	}

	return { 'x': x, 'y': y };
}

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

function inchToCm(inches) {
	return inches * 2.54;
}

function cmToFt(cm) {
	return cm / 30.48;
}

function ftToCm(foot) {
	return foot * 30.48;
}