var ctx, canvas, image, toiletDepth, toiletWidth;

var domReady = function(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


var ROOM = {
	topLeft    : { x: 0.1, y: 0.1 },
	topRight   : { x: 10.1, y: 0.1 },
	bottomLeft : { x: 0.1, y: 10.1 },
	bottomRight: { x: 10.1, y: 10.1 },
	door       : {
		pos1: { x: 0.6, y: 0.1 },
		pos2: { x: 3.6, y: 0.1 }
	}
};

domReady(function() {
	
	canvas = document.getElementById("mainCanvas");
	canvas.style.background = '#FDFDFD';
	ctx = canvas.getContext("2d");
	var angleInDegrees=0;

	toiletWidth = inchToCm(20);
	toiletDepth = inchToCm(30);
	
	image     = document.createElement("img");
	image.src ="img/toilet_top.png";
	
	image.onload = function(){
		drawRoom();
		drawDoor();
		
		ctx.drawImage(image, 0, 0, toiletDepth, toiletWidth);

		drawRotated(0);
		drawRotated(90);
		drawRotated(180);
		drawRotated(270);

	};

	return;
});

function drawRotated(degrees) {
	var x, y;
  
  ctx.save();
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(degrees * Math.PI/180);
	
	if (degrees === 0 || degrees === 360) {
		ctx.translate(-canvas.width/2, -canvas.height/2);
  }
  if (degrees === 90) {
		x = ( -canvas.width/ 2 ) ;
		y = ( canvas.height/2 ) - toiletWidth;
		ctx.translate(x, y);
  }
  if (degrees === 180) {
		x = ( canvas.width/ 2 ) - toiletDepth;
		y = ( canvas.height/2 ) - toiletWidth;
		ctx.translate(x, y);
  }
  if (degrees === 270) {
		x = ( canvas.width/ 2 ) - toiletDepth;
		y = ( -canvas.height/2 );
		ctx.translate(x, y);
  }
  ctx.drawImage(image, 0, 0, toiletDepth, toiletWidth);
  ctx.restore();
}

function drawRoom() {
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