var exports  = module.exports;
var room     = require('./room');
var rrFinder = require('./rrFinder');

/*
	takes in the string from the url
	validates it
	returns all possible restroom configurations
*/
exports.getRestrooms = function (roomParams) {
	var newRoom = room.newRoom(roomParams);
	
	if (newRoom) {

		return rrFinder.findAccessible(newRoom);

	} else {
		
		return false;
	
	}
};
