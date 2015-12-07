var exports = module.exports;
var rr      = require('./room');

/*
	takes in the string from the url
	validates it
	returns all possible restroom configurations
*/
exports.getRestrooms = function (roomParams) {
	console.log("roomParams in Controller: ", roomParams);
	rr.Room('x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5');
	// var newRoom = new Room(params);

};
