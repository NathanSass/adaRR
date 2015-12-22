(function() {
	
	var exports = module.exports;

	var Util = require('./DrawingUtil.jsx');
	
	/////////// CONSTANTS AND GLOBALS /////////

	 var canvas     = document.getElementById('canvas'),
		ctx         = canvas.getContext('2d'),
		rect        = {},
		drag        = false,
		mouseX,
		mouseY,
		closeEnough = 10,
		dragTL = dragBL = dragTR = dragBR = false;

	///////////////////////////////////////////
	
	exports.init = function(id){
		console.log("IN INIT")
	};
	
}());