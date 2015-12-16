(function() {
	
	var exports     = module.exports;
	var querystring = require('querystring');

	var ROOM;

	exports.newRoom = function(urlString) {
		var cleanParams = sanitizeParams(urlString);
		if (cleanParams) {
			return get();
		} else {
			console.log("malformed url string");
			// TODO: Handle a malformed url
		}
		
	};

	exports.get = function(){
		return get();
	};

	/////////////////
	function get() {
		return ROOM;
	}


	function sanitizeParams (urlString) {
		var dirtyRR = querystring.parse(urlString);
		try {
			
			ROOM = {
				x: parseFloat(dirtyRR.x),
				y: parseFloat(dirtyRR.y),
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