const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
// const { JWT_SECRET } = require('./configuration');
const config = require('./config');
const User = require('./models/user');


// JSON WEB TOKEN STRATEGY
// New Strategy will be aware where the token will be taken from and what key to use
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.JWT_SECRET
}, async (payLoad, done) => {
	try{
		// Find user's specified in Token
		const user = await User.findById(payLoad.sub);
		// If usser doesn't exist, handle it
		if(!user){
			return done(null, false);
		}
		

		// Othersie return the user
		done(null, user);
	} catch(error){
		done(error, false);
	}
}));


// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
	clientID: config.oauth.google.clientID,
  	clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
	try {
		console.log('accessToken', accessToken);
		console.log('refreshToken', refreshToken);
		console.log('profile', profile);

		// CHECK whether this current user exist in our DB
		const existingUser = await User.findOne({ "google.id": profile.id });
		if(existingUser){
			console.log('User already exist in our DB');
			return done(null, existingUser);
		}
		console.log('User doesnt exist, created new one');

		// If new account
		const newUser = new User({
			method: 'google',
			google: {
				id: profile.id,
				// email: profile.emails[0].value
				email: profile.emails
			}
		});
		await newUser.save();
		done(null, newUser);
	} catch(error){
		done(error, false, error.message);
	}
}));


passport.use('facebookToken', new FacebookTokenStrategy({
	clientID: config.oauth.facebook.clientID,
	clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
	try {
		console.log('accessToken', accessToken);
		console.log('refreshToken', refreshToken);
		console.log('profile', profile);

	const existingUser = await User.findOne({ "facebook.id": profile.id });
	if (existingUser){
		return done(null, existingUser);
	}
	const newUser = new User({
		method: 'facebook',
		facebook: {
			id: profile.id,
			email: profile.emails[0].value
		}
	});

	await newUser.save();
	done(null, newUser);
	} catch(error){
		done(error, false, error.message);
	}
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
	usernameField: 'email'
}, async (email, password, done) => {
	try {
		console.log('email', email);
		// Find the user given the email
		const user = await User.findOne({ "local.email": email });

		// If not, handle it
		if(!user){
			return done(null, false);
		}

		// Check if the password is correct
		const isMatch = await user.isValidPassword(password);

		console.log('isMatch', isMatch);

		// If not, handle it
		if(!isMatch){
			return done(null, false);
		}

		// Otherwis, return the user
		done(null, user);
	} catch(error){
		done(error, false);
	}
}));