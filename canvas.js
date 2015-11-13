var ctx, canvas, image, toiletDepth, toiletWidth;

var domReady = function(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


var ROOM = {
	topLeft    : { x: 0, y: 0 },
	topRight   : { x: 10, y: 0 },
	bottomLeft : { x: 0, y: 10 },
	bottomRight: { x: 10, y: 10 }
};

domReady(function() {
    // Your code here
	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext("2d");
	var angleInDegrees=0;

	toiletWidth = inchToCm(20);
	toiletDepth = inchToCm(30);
	image    = document.createElement("img");
	image.onload = function(){
		ctx.drawImage(image, 5, 5, toiletDepth, toiletWidth);
	};
	image.src="img/toilet_top.jpg";

	drawRoom();

	// $("#clockwise").click(function(){ 
	//     angleInDegrees+=90;
	//     drawRotated(angleInDegrees);
	// });

	// $("#counterclockwise").click(function(){ 
	//     angleInDegrees-=90;
	//     drawRotated(angleInDegrees);
	// });

	// function drawRotated(degrees){
 //    ctx.clearRect(0,0,canvas.width,canvas.height);
 //    ctx.save();
 //    ctx.translate(canvas.width/2,canvas.height/2);
 //    ctx.rotate(degrees*Math.PI/180);
 //    ctx.drawImage(image,-image.width/2,-image.width/2);
 //    ctx.restore();
	// }





});

function drawRoom() {
	// First Horiz
	ctx.moveTo( ftToCm(ROOM.topLeft.x), ftToCm(ROOM.topLeft.y) );
	ctx.lineTo( ftToCm(ROOM.topRight.x), ftToCm(ROOM.topRight.y) );
	// First Vert
	ctx.lineTo( ftToCm(ROOM.bottomRight.x), ftToCm(ROOM.bottomRight.y) );
	// Second Horiz
	ctx.lineTo( ftToCm(ROOM.bottomLeft.x), ftToCm(ROOM.bottomLeft.y) );
	// Second Vert
	ctx.lineTo( ftToCm(ROOM.topLeft.x), ftToCm(ROOM.topLeft.y) );



	ctx.lineWidth=2;
	ctx.stroke();

}

function inchToCm(inches) {
	return inches * 2.54;
}

function ftToCm(foot) {
	return foot * 30.48;
}