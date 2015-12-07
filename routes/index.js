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
	var dirtyRoomString = req.params.roomParams;
  
  var restrooms = rrController.getRestrooms(dirtyRoomString);
  
  res.render('index', { 'roomParams': dirtyRoomString });
});

module.exports = router;