var express = require('express');
var router = express.Router();

var Search_Controller = require('../../controllers/search');

// General Search
router.post('/g_search', async function(req, res, next) {
	var results = await Search_Controller.g_search(req.body.query);
	res.json({ results: results });
});

// Youtube search
router.post('/y_search', async function(req, res, next) {
	var results = await Search_Controller.y_search(req.body.query);
	res.json({ results: results });
});

// Audioscrobbler
router.post('/a_search', async function(req, res, next) {
	var results = await Search_Controller.a_search(req.body.query);
	res.json({ results: results });
});


module.exports = router;