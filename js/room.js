(function() {
	
	var exports     = module.exports;
	var querystring = require('querystring');

	var ROOM;

	exports.Room = function(urlString) {
		var cleanParams = sanitizeParams(urlString);
		if (cleanParams) {
			console.log(ROOM);
		} else {
			console.log("malformed url string");
			// TODO: Handle a malformed url
		}
		
	};

	exports.helloWorld = function() {
		console.log("helloWorld from room.js");
	};

	/////////////////

	function sanitizeParams (urlString) {
		var dirtyRR = querystring.parse(urlString);
		try {
			
			ROOM = {
				x: dirtyRR.x,
				y: dirtyRR.y,
				door: {
					pos1: { x: parseFloat(dirtyRR.doorpos1[0]), y: parseFloat(dirtyRR.doorpos1[1]) },
					pos2: { x: parseFloat(dirtyRR.doorpos2[0]), y: parseFloat(dirtyRR.doorpos2[1]) },
				}
			};

			return true;
		}
		catch(err){
			console.log("malformed url string", err);
			return false;
		}
	}

}());