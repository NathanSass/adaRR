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
	console.log(newRoom);
	if (newRoom) {
		rrFinder.findAccessible(newRoom);
		return true; // later will return the array of RR
	} else {
		console.log("Not a valid room");
		return false;
	}
};
