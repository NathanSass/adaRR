(function() {
	
	var exports = module.exports;

	exports.Room = function(params) {
		var cleanParams = sanitizeParams(params);
		
	};

	exports.helloWorld = function() {
		console.log("helloWorld from room.js");
	};

}());


// Room.prototype = {
// 	sanitizeParams = function (params) {

// 	}
// };
