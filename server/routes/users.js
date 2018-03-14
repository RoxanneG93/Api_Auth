const express = require('express');
const router = require('express-promise-router')();
const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passport = require('passport');
const passportConfig = require('../passport');

// Refactor methods for the code below
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });

// REFACTORED ROUTES
router.route('/signup')
	.post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
	.post(validateBody(schemas.authSchema), passportSignIn,  UsersController.signIn);

router.route('/oauth/google')
	.post(passportGoogle, UsersController.googleOAuth);

router.route('/oauth/facebook')
	.post(passportFacebook, UsersController.facebookOAuth);

router.route('/secret')
	.get(passportJWT, UsersController.secret);

// router.get('/', function(req, res, next) {
// 	// Comment out this line:
//   //res.send('respond with a resource');

//   // And insert something like this instead:
//   res.json([{
//   	id: 1,
//   	username: "samsepi0l"
//   }, {
//   	id: 2,
//   	username: "D0loresH4ze"
//   }]);
// });

// ROUTES BEFORE
// router.route('/signup')
// 	.post(validateBody(schemas.authSchema), Users.signUp);

// router.route('/signin')
// 	.post(validateBody(schemas.authSchema), passport.authenticate('local', { session: false }),  Users.signIn);

// router.route('/secret')
// 	.get(passport.authenticate('jwt', { session: false }), Users.secret);

module.exports = router;