var express      = require('express');
var router       = express.Router();
var rrController = require('../js/controller');

/* GET home page. */
router.get('/*', function(req, res, next) {
	res.render('index');
});

router.post('/finddoor/:roomDimensions', function(req, res, next) {
	var dirtyRoomDimensions = JSON.parse(req.params.roomDimensions);	
	
	var data = rrController.getRoomNoDoor(dirtyRoomDimensions);
	
	res.send(data);
});

/* GET rectangular room builder page*/
router.post('/toiletOptions/:roomParams', function(req, res, next) { // toiletOptions/x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5'

	var dirtyRoomString    = req.params.roomParams;

	var restroomsToDisplay = rrController.getRestrooms(dirtyRoomString);
	
	var data =  JSON.stringify(restroomsToDisplay);

	res.send(data);
});

module.exports = router;