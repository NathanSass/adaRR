var express      = require('express');
var router       = express.Router();
var rrController = require('../js/controller');

/* GET home page. */
router.get('/*', function(req, res, next) {
	res.render('index');
});

/*
	Accepts a room shape, validates and returns nearly the same thing
	This data will be used in the door finder
*/
router.post('/finddoor/:roomDimensions', function(req, res, next) {
	var dirtyRoomDimensions = JSON.parse(req.params.roomDimensions);	
	
	var data = rrController.getRoomNoDoor(dirtyRoomDimensions);
	data = JSON.stringify(data);
	res.send(data);
});

/*
	Accepts a room shape with a door located.
	Validates it and returns an array of possible toilet configurations
*/
router.post('/chooseToiletLocation/:roomParams', function(req, res, next) { // toiletOptions/x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5'

	var dirtyRoomObj       = JSON.parse(req.params.roomParams);

	var restroomsToDisplay = rrController.getRestrooms(dirtyRoomObj);
	
	var data =  JSON.stringify(restroomsToDisplay);

	res.send(data);
});

module.exports = router;