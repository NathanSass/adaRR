var exports  = module.exports;
var room     = require('./room');
var rrFinder = require('./rrFinder');

/*
	takes in the string from the url
	validates it
	returns all possible restroom configurations
*/
exports.getRestrooms = function (roomParams) {
	var url = 'x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5';
	var newRoom = room.buildRoom(url);
	
	if (newRoom) {
		
		return rrFinder.findAccessible(newRoom);

	} else {
		
		return false;
	
	}
};
