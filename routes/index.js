var express = require('express');
var router = express.Router();
// var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('In the index route');
	res.render('index');
});




/* GET rectangular room builder page*/
router.get('/rect/:roomParams', function(req, res, next) { // x=8&y=5&doorpos1=5.75&doorpos1=5&doorpos2=8&doorpos2=5'
	// console.log()
  // var roomParams = querystring.stringify(req.params.roomParams);
	var roomParams = req.params.roomParams;
	// var url_parts = url.parse(req.params.roomParams, true);
	// console.log(url_parts);
	// var query = url_parts.query;

  console.log('Room Params ', roomParams);
  // res.send('asdasdda');
  res.render('index');

});
module.exports = router;
