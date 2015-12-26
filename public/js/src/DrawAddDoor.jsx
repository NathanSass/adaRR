import {Shape, Room, Door} from "./classes/Shape.jsx";

(function() {
	"use strict";
	
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

		// **** Options! ****
  
		this.selectionColor = '#417505';
		this.selectionWidth = 1;  
		this.interval       = 30;

		// **** Functions to talk to React ****
		this.setData;

		setInterval(function() { this.draw(); }.bind(this), this.interval);

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
				if (shapes[i].contains(mx, my) && shapes[i].isDraggable) {
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
			var objectClass;
			if (this.selection) { objectClass = this.selection.constructor.name; }
			if ( this.dragging && objectClass == "Door" ){
				var mouse = this.getMouse(e);
				var door  = this.selection;
				
				var xPosition = mouse.x - this.dragoffx;
				var yPosition = mouse.y - this.dragoffy;
				
				var dragStrip = 30;

				var testShapeParams = {
					x: xPosition,
					y: yPosition,
					w: 10,
					h: 10
				};

				var cursor = new Shape(testShapeParams);
					
				
				var roomW = this.ROOM.max.x - this.ROOM.min.x;
				var roomH = this.ROOM.max.y - this.ROOM.min.y;
				
				if (xPosition > this.ROOM.min.x && 
					xPosition < this.ROOM.max.x - door.w && 
					
					yPosition < this.ROOM.min.y + dragStrip &&
					yPosition > this.ROOM.min.y - dragStrip) { // First Horiz
					
					door.makeHoriz();
					door.x = mouse.x - this.dragoffx;
					door.y = this.ROOM.min.y - this.ROOM.border;  
					cursor.draw(this.ctx);
				}

				if (xPosition > this.ROOM.min.x && 
					xPosition < this.ROOM.max.x - door.w && 
					
					yPosition < this.ROOM.max.y + dragStrip &&
					yPosition > this.ROOM.max.y - dragStrip) { // Second Horiz
					
					door.makeHoriz();
					door.x = mouse.x - this.dragoffx;
					door.y = this.ROOM.max.y - this.ROOM.border;
					cursor.draw(this.ctx);  
				}

				if (yPosition > this.ROOM.min.y - door.h &&
					yPosition < this.ROOM.max.y - door.h &&
					
					xPosition > this.ROOM.max.x - door.h &&
					xPosition > this.ROOM.max.x - dragStrip &&
					xPosition < this.ROOM.max.x + dragStrip ) { // First Vert
					 
						door.makeVert();
						door.x = this.ROOM.max.x - this.ROOM.border;
						door.y = mouse.y - this.dragoffy; 
						cursor.draw(this.ctx);
				}

				if (yPosition > this.ROOM.min.y - door.h &&
					yPosition < this.ROOM.max.y - door.h &&

					xPosition > this.ROOM.min.x - door.h &&
					xPosition < this.ROOM.min.x + dragStrip &&
					xPosition > this.ROOM.min.x - dragStrip ) { // Second Vert
					 
						door.makeVert();
						door.x = this.ROOM.min.x - this.ROOM.border;
						door.y = mouse.y - this.dragoffy; 
						cursor.draw(this.ctx);
				}

				this.valid = false; // Something's dragging so we must redraw
			}
		}.bind(this), true);
	};

	CanvasState.prototype.mouseUpListener = function() {
		this.canvas.addEventListener('mouseup', function(e) {
			
			var door = {
				pos1: {},
				pos2: {}
			};

			if ( this.door.isHoriz ) { // Could micro optimize this by switching all x's and y's and w's & h's 
				door.pos1.x = this.door.x - this.ROOM.room.x;
				door.pos1.y = door.pos2.y = this.door.y - this.ROOM.room.y + this.ROOM.border;

				door.pos2.x = door.pos1.x + this.door.w;

			} else {
				door.pos1.y = this.door.y - this.ROOM.room.y; 
				door.pos1.x = door.pos2.x = this.door.x - this.ROOM.room.x + this.ROOM.border;

				door.pos2.y = door.pos1.y + this.door.h;
			}

			var data = {
				x: this.ROOM.room.w,
				y: this.ROOM.room.h,
				doorpos1: [ door.pos1.x, door.pos1.y ],
				doorpos2: [ door.pos2.x, door.pos2.y ]	
			};
			
			this.setData(data);
			
			this.dragging = false;
		
		}.bind(this), true);
	};

	/*
		Currently no double click implemented
	*/
	CanvasState.prototype.dblClickListener = function() {
		
		this.canvas.addEventListener('dblclick', function(e) {
			var mouse = this.getMouse(e);
		}.bind(this), true);
	};

	/*
		Adds room and creates a room type variable
	*/
	CanvasState.prototype.addRoom = function(room) {
		this.ROOM        = {};
		
		this.ROOM.border = room.lineWidth / 2; //Used to offset door onto roomWall
		
		this.ROOM.min    = {
			x: room.x,
			y: room.y
		};

		this.ROOM.max    = {
			x: room.x + room.w,
			y: room.y + room.h
		};
		
		this.ROOM.room = room;

		this.addShape(room);
	};

	/* 
		Adds door
	*/
	CanvasState.prototype.addDoor = function(door){
		
		door.x    = this.ROOM.min.x + this.ROOM.border;
		door.y    = this.ROOM.min.y - this.ROOM.border;
		
		this.door = door;
		
		this.addShape(door);
	};

	
	/*
		Adds a new shapes
	*/
	CanvasState.prototype.addShape = function(shape) {
		this.shapes.push(shape);
		this.valid = false;
	};

	CanvasState.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	};

	/*
		While draw is called as often as the INTERVAL variable demands,
		It only ever does something if the canvas gets invalidated by our code
	*/ 
	CanvasState.prototype.draw = function() {
	  // if our state is invalid, redraw and validate!
	  if (!this.valid) {
	    var ctx = this.ctx;
	    var shapes = this.shapes;
	    this.clear();
	    
	    // ** Add stuff you want drawn in the background all the time here **
	    
	    // draw all shapes
	    var l = shapes.length;
	    for (var i = 0; i < l; i++) {
	      var shape = shapes[i];
	      // We can skip the drawing of elements that have moved off the screen:
	      if (shape.x > this.width || shape.y > this.height ||
	          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
	      shapes[i].draw(ctx);
	    }
	    
	    // draw selection
	    // right now this is just a stroke along the edge of the selected Shape
	    if (this.selection !== null) {
	      ctx.strokeStyle = this.selectionColor;
	      ctx.lineWidth = this.selectionWidth;
	      var mySel = this.selection;
	      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
	    }
	    
	    // ** Add stuff you want drawn on top all the time here **
	    
	    this.valid = true;
	  }
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
		
		var roomParams = {
			x: 100,
			y: 50,
			w: params.rect.w,
			h: params.rect.h,
		};

		C.setData = params.setData; // React function for sending data to frontend
		
		C.addRoom(new Room(roomParams));
		C.addDoor(new Door());
	};

}());