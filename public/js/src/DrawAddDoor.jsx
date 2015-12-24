(function() {
	
	var exports = module.exports;
	
	var Util    = require('./DrawingUtil.jsx');
	
	
	function CanvasState(canvas) {
		
		this.canvas = canvas;
		this.width  = canvas.width;
		this.height = canvas.height;
		this.ctx    = canvas.getContext('2d');

		// **** State Variables ****
		
		this.valid     = false; // when set to false, the canvas will redraw everything
		this.shapes    = [];    // the collection of things to be drawn
		this.dragging  = false; // Keep track of when we are dragging
		this.selection = null;  // the current selected object.
		this.dragoffx  = 0;     // See mousedown and mousemove events for explanation
		this.dragoffy  = 0;

		//fixes a problem where double clicking causes text to get selected on the canvas
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
	}

	CanvasState.prototype.mouseDownListener = function() {
		this.canvas.addEventListener('mousedown', function(e) {
			
			var mouse  = this.getMouse(e);
			var mx     = mouse.x;
			var my     = mouse.y;
			var shapes = this.shapes;
			var l      = shapes.length;
			
			for (var i = l-1; i >= 0; i--) {
				if (shapes[i].contains(mx, my)) {
					var mySel = shapes[i];
					// Keep track of where in the object we clicked
					// so we can move it smoothly (see mousemove)
					this.dragoffx = mx - mySel.x;
					this.dragoffy = my - mySel.y;
					this.dragging = true;
					this.selection = mySel;
					this.valid = false;
					return;
				}
			}
			// havent returned means we have failed to select anything.
			// If there was an object selected, we deselect it
			if (this.selection) {
				this.selection = null;
				this.valid = false; // Need to clear the old selection border
			}
		}.bind(this), true);
	};

	CanvasState.prototype.mouseMoveListener = function() {
		this.canvas.addEventListener('mousemove', function(e) {
			if (this.dragging){
				var mouse = this.getMouse(e);
				// We don't want to drag the object by its top-left corner, we want to drag it
				// from where we clicked. Thats why we saved the offset and use it here
				this.selection.x = mouse.x - this.dragoffx;
				this.selection.y = mouse.y - this.dragoffy;   
				this.valid = false; // Something's dragging so we must redraw
			}
		}.bind(this), true);
	};

	CanvasState.prototype.mouseUpListener = function() {
		this.canvas.addEventListener('mouseup', function(e) {
			this.dragging = false;
		}.bind(this), true);
	};

	/*
		Adds a new shapes
	*/
	CanvasState.prototype.dblClickListener = function() {
		
		this.canvas.addEventListener('dblclick', function(e) {
			var mouse = this.getMouse(e);
			// this.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
		}.bind(this), true);
	};

	/* 
		Creates an object with x and y defined, set to the mouse position relative to the state's canvas
		If you wanna be super-correct this can be tricky, we have to worry about padding and borders
	*/
	CanvasState.prototype.getMouse = function(e) {
	  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	  
	  // Compute the total offset
	  if (element.offsetParent !== undefined) {
	    do {
	      offsetX += element.offsetLeft;
	      offsetY += element.offsetTop;
	    } while ((element = element.offsetParent));
	  }

	  mx = e.pageX - offsetX;
	  my = e.pageY - offsetY;
	  
	  return {x: mx, y: my};
	};

	function addListeners() {
		console.log("ListenersAdded");
	}
	
	function buildCanvas() {

		var container = document.getElementById('addDoorContainer');

		var canvas    = document.createElement('canvas');

		canvas.id     = "addDoorCanvas";
		canvas.width  = 500;
		canvas.height = 400;
		canvas.style.background = '#FDFDFD';

		container.appendChild(canvas);
	}


	exports.init = function(params) {
		
		buildCanvas();
		
		var C = new CanvasState(document.getElementById('addDoorCanvas'));
		C.mouseDownListener();
		C.mouseMoveListener();
		C.mouseUpListener();
		C.dblClickListener();
	};

}());