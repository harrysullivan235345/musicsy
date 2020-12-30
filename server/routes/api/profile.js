var express = require('express');
var router = express.Router();
var Profile_Controller = require('../../controllers/profile');

router.get('/get_profile', async function (req, res, next) {
	if (!req.user) {
		res.json({ profile: false })
	} else {
		var profile = await Profile_Controller.get_profile(req.user);
		profile.id = req.user;
		res.json({ profile: profile });
	}
})

router.post('/change_email', function (req, res, next) {
	var new_email = req.body.email;
	Profile_Controller.change_email(req.user, new_email)
		.then((valid) => {
			if (valid.err) {
				res.json({ done: false })
			} else {
				res.json({ done: true })
			}
		})
});

router.post('/password_correct', async function (req, res) {
	var correct = await Profile_Controller.password_correct(req.user, req.body.password);
	res.json({ correct: correct });
})

router.post('/change_password', function (req, res, next) {
	var current_password = req.body.current_password;
	var new_password = req.body.new_password;
	var new_password_confirm = req.body.new_password_confirm;

	Profile_Controller.change_password(req.user, current_password, new_password, new_password_confirm)
		.then((valid) => {
			if (valid.err) {
				res.json({ data: valid.err })
			} else if (valid.redirect) {
				req.logout();
				res.json({ done: true })
			}
		})
});

router.post('/change_avatar', async function (req, res, next) {
	var file = req.files.file;
	var crop_box = JSON.parse(req.body.crop_box);

	var upload_file_name = await Profile_Controller.change_avatar(file, crop_box, req.user);
	res.json({ avatar: upload_file_name })
})

module.exports = router