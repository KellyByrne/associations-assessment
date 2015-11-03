var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associations-assessment')
var trails = db.get('trails')
var parks = db.get('parks')
var states = db.get('states')
/* GET home page. */
router.get('/', function(req, res, next) {
	trails.find({}, function(err, data){
		res.render('index', {trails: data});
	})
});

module.exports = router;
