(function() {
	
	var exports = module.exports;

	var Util = require('./DrawingUtil.jsx');
	
	/////////// CONSTANTS AND GLOBALS /////////

	 var canvas,
		ctx,
		rect        = {},
		drag        = false,
		mouseX,
		mouseY,
		closeEnough = 10,
		dragTL = dragBL = dragTR = dragBR = false;

	///////////////////////////////////////////
	
	exports.init = function(){

		buildCanvas();

		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mouseup', mouseUp, false);
		canvas.addEventListener('mousemove', mouseMove, false);

		rect = {
			startX: 100,
			startY: 200,
			w: 305,
			h: 200
		};

	};

	function buildCanvas() {

		var container = document.getElementById('resizeableRoomContainer');

		canvas        = document.createElement('canvas');
		ctx           = canvas.getContext('2d');

		canvas.id     = "resizeableRoom";
		canvas.width  = 500;
		canvas.height = 500;
		canvas.style.background = '#FDFDFD';

		container.appendChild(canvas);
	}
	
	function mouseDown(e) {
		var mouse = getMouse(e);
		// console.log("mouse ": mouse);
        mouseX = mouse.x;
        mouseY = mouse.y;

        // if there isn't a rect yet
        if (rect.w === undefined) {
            rect.startX = mouseY;
            rect.startY = mouseX;
            dragBR = true;
        }

        // if there is, check which corner
        //   (if any) was clicked
        //
        // 4 cases:
        // 1. top left
        else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY)) {
            dragTL = true;
        }
        // 2. top right
        else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY)) {
            dragTR = true;

        }
        // 3. bottom left
        else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
            dragBL = true;

        }
        // 4. bottom right
        else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
            dragBR = true;

        }
        // (5.) none of them
        else {
            // handle not resizing
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();

    }

    function checkCloseEnough(p1, p2) {
        return Math.abs(p1 - p2) < closeEnough;
    }

    function mouseUp() {
        dragTL = dragTR = dragBL = dragBR = false;
    }

	function mouseMove(e) {
		var mouse = getMouse(e);
        mouseX    = mouse.x;
        mouseY    = mouse.y;

	    if (dragTL) {
	        rect.w += rect.startX - mouseX;
	        rect.h += rect.startY - mouseY;
	        rect.startX = mouseX;
	        rect.startY = mouseY;
	    } else if (dragTR) {
	        rect.w = Math.abs(rect.startX - mouseX);
	        rect.h += rect.startY - mouseY;
	        rect.startY = mouseY;
	    } else if (dragBL) {
	        rect.w += rect.startX - mouseX;
	        rect.h = Math.abs(rect.startY - mouseY);
	        rect.startX = mouseX;
	    } else if (dragBR) {
	        rect.w = Math.abs(rect.startX - mouseX);
	        rect.h = Math.abs(rect.startY - mouseY);
	    }
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    draw();
	}

	function draw() {
		drawRectangle();
	    drawHandles();
	    drawTextForSegmentLengths();
	}

	function drawTextForSegmentLengths() {
		var firstSide = {
			txt: cmToPresentation((rect.startX + rect.w) - rect.startX) ,
			x: rect.startX + (rect.w / 2 ),
			y: rect.startY - closeEnough
		};
		drawText(firstSide);
	}

	function cmToPresentation(cm) {
		var length = cmToFtIn(cm);
		return length.ft + '\' ' + length.in + '\"';
	}

	function cmToFtIn(cm) {
		var totalInches = cmToIn(cm);
		var feet = Math.floor(totalInches / 12);
		var inches =  Math.round(totalInches - ( feet * 12 ));
		return { ft: feet, in: inches };
	}

	function cmToIn(cm){
		return cm * 0.393701;
	}

	function drawText(params) {
		ctx.beginPath();
		ctx.fillStyle    = 'black';
		ctx.font         = '10pt sans-serif';
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText( params.txt, params.x, params.y );
		ctx.closePath();
	}

	function drawRectangle() {
		ctx.beginPath();
		ctx.lineWidth   = 10;
		ctx.fillStyle   = '#F5F5F5';
		ctx.strokeStyle = '#979797';
		ctx.stroke();
	    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
	    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
	    ctx.closePath();
	}
	   
	function drawCircle(x, y, radius) {
		ctx.beginPath();
	    ctx.fillStyle = "#6F6F6F";
	    ctx.beginPath();
	    ctx.arc(x, y, radius, 0, 2 * Math.PI);
	    ctx.fill();
	    ctx.closePath();
	}

	function drawHandles() {
	    drawCircle(rect.startX, rect.startY, closeEnough);
	    drawCircle(rect.startX + rect.w, rect.startY, closeEnough);
	    drawCircle(rect.startX + rect.w, rect.startY + rect.h, closeEnough);
	    drawCircle(rect.startX, rect.startY + rect.h, closeEnough);
	}

	function getMouse(e) {
	  var element = canvas, offsetX = 0, offsetY = 0, mx, my;
	  
	  // Compute the total offset
	  if (element.offsetParent !== undefined) {
	    do {
	      offsetX += element.offsetLeft;
	      offsetY += element.offsetTop;
	    } while ((element = element.offsetParent));
	  }

	  // Add padding and border style widths to offset
	  // Also add the offsets in case there's a position:fixed bar
	  // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	  // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	  mx = e.pageX - offsetX;
	  my = e.pageY - offsetY;
	  
	  // We return a simple javascript object (a hash) with x and y defined
	  return {x: mx, y: my};
	}
}());