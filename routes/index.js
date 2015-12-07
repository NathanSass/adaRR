var express      = require('express');
var router       = express.Router();
var rrController = require('../js/controller');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('In the index route');
	res.render('index');
});




/* GET rectangular room builder page*/
router.get('/:roomParams', function(req, res, next) { // x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5'
	var messageOnDOM;
	var dirtyRoomString = req.params.roomParams;
  
  var restroomsToDisplay = rrController.getRestrooms(dirtyRoomString);

  if (restroomsToDisplay) {
		// SEND DATA TO DOM
		console.log('restrooms to display: ', restroomsToDisplay);
		messageOnDOM = dirtyRoomString;
  } else {
		messageOnDOM = "INVALID RESTROOM";
  }

  res.render('index', { 'roomParams': messageOnDOM });

});

module.exports = router;