var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associations-assessment')
var trails = db.get('trails')
var parks = db.get('parks')
var states = db.get('states')

router.get('/:id', function(req, res, next) {
	 trails.findOne({_id: req.params.id})
	.then(function(trails){
		var stateIds = trails.states;
		return states.find({_id: {$in: stateIds}})
		})
	.then(function(states){
		res.render('trails', {trail: trails, states: states})
	})
});

router.get('/states/:id', function(req, res, next){
	states.find({_id: req.params.id})
	.then(function(state){
		var parksIds = state[0].parks;
		return parks.find({_id: {$in: parksIds}}).then(function(parks){
			res.render('states', {state:state[0],  parks: parks})
		});
	})
})


router.get('/states/:id/edit', function(req, res, next){
	states.find({_id: req.params.id}, function(err, data){
			res.render('edit', {state: data})
	})
})

router.post('/states/:id', function(req, res, next){
	states.findOne({_id: req.params.id}).then(function(states){
		return parks.insert({
			name: req.body.name,
			state: states._id,
			trail: states.trail[0]})
	.then(function(parks){
		console.log(parks._id)
		console.log(states._id)
		states.update({ _id: states._id}, { $push: {parks: parks._id} }).then(function(data){
			console.log("working?")
			res.redirect('/')
		})
})
})
})

module.exports = router;

