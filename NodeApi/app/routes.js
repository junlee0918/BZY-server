var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');

var db = mongoose.connection;
	db.on('error', function(err){
		console.log('BZY-DB connection failed with error:', err);
	});
	db.once('open', function(){
		console.log('Connected to BZY-DB.');
	})
var areas = require('./areas.js');
var proxy = require('./proxy.js');
module.exports = function(router) {

	// ROUTES FOR OUR API
	// =============================================================================

	// middleware to use for all requests
	router.use(function(req, res, next) {
		// do logging
		console.log('Something is happening.');
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// proxy router
	router.route('/proxy')
		.get(proxy.getData)

	router.route('/areas/getByCategory/:keystr')
		.get(areas.getAreasByCategory);

	router.route('/areas/getByCategoryPagination/:category/:page([0-9]+)/:limit([0-9]+)/:lat/:lng')
		.get(areas.getAreasByCategoryPagination);

	router.route('/areas/getNearby/:lat/:lng/:distance')
		.get(areas.getAreasNearby);

	router.route('/areas/test')
		.get(areas.test);

};