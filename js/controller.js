var exports = module.exports;
var rr      = require('./room');

/*
	takes in the string from the url
	validates it
	returns all possible restroom configurations
*/
exports.getRestrooms = function (roomParams) {
	console.log("roomParams in Controller: ", roomParams);
	rr.helloWorld();
	// var newRoom = new Room(params);
};
