var express      = require('express');
var router       = express.Router();
var rrController = require('../js/controller');

/* GET home page. */
router.get('/*', function(req, res, next) {
	res.render('index');
});

router.post('/finddoor/:roomDimensions', function(req, res, next) {
	var dirtyRoomDimenstions = req.params.roomDimensions;	
	// Do something with dirty room string so that it returns a drawable shape and conveys to react to load a new view
	// needs to return a data object of a single room to be plot
	res.send("Hi");
});

/* GET rectangular room builder page*/
router.post('/toiletOptions/:roomParams', function(req, res, next) { // toiletOptions/x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5'

	var dirtyRoomString    = req.params.roomParams;

	var restroomsToDisplay = rrController.getRestrooms(dirtyRoomString);
	
	var data =  JSON.stringify(restroomsToDisplay);

	res.send(data);
});

module.exports = router;