const JWT = require('jsonwebtoken');
const User = require('../models/user');
const {JWT_SECRET} = require('../configuration');

signToken = user => {
	return JWT.sign({
		iss: 'Roxy',
		sub: user._id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 1)
	}, JWT_SECRET);
}

module.exports = {
	signUp: async (req, res, next) => {
		// get email and password
		// req.value.body
		console.log('contents of req.value.body', req.value.body);
		console.log('usersController.signup() called');

		const {email, password } = req.value.body;

		// Check if there is a user with the same email
		const foundUser = await User.findOne({ "local.email": email });
		if(foundUser){ 
			return res.status(409).json({ error: "email is already in use"});
		}

		// Create a new User
		// const newUser = new User({
		// 	email: email,
		// 	password: password
		// });


		// ****ES6 version of the above
		// Create a new user
		const newUser = new User({ 
			method: 'local',
			local: {
				email: email,
				password: password 
			}
		});
		await newUser.save();

		// Generate Token
		const token = signToken(newUser);

		
		// Respond with Token
		res.status(200).json({ token });

	},
	signIn: async (req, res, next) => {
		// Generate Token
		// console.log('req.user', req.user);
		const token = signToken(req.user);
		res.status(200).json({ token });
		console.log('sucessful login!');
	},

	googleOAuth: async (req, res, next) => {
		// Generate Tokem
		console.log('req.user', req.user);
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	facebookOAuth: async (req, res, next) => {
		console.log('Got here');
		console.log('req.user', req.user);
		// Generate Token
		const token = signToken(req.user);
		res.status(200).json({ token });

	},

	secret: async (req, res, next) => {
		console.log('I managed to get here!');
		res.json({ secret: "resource "});
	}
}