(function() {
	var exports = module.exports;

	exports.domReady = function(callback) {
		document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
	};

	exports.inchToCm = function(inches) {
		return inches * 2.54;
	};

	exports.cmToFt = function(cm) {
		return cm / 30.48;
	};

	exports.ftToCm = function(foot) {
		return foot * 30.48;
	};

	/*
		Given a degree of rotation
		Finds the equivalent x,y coordinate pair in Ft
	*/
	exports.findEquivalentCoordinate = function (params) {
		var rotation = params.rotation;

		var _x = params.x, // these are the disired coordinates
			_y = params.y;

		var fixtureDepth       = params.fixtureDepth;
		var fixtureCenterPoint = params.fixtureWidth / 2;
		
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
	};



}());