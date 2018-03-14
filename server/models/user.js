const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a Schema
const userSchema = new Schema({
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true
	},
	local: {
		email: {
			type: String,
			lowercase: true
		},
		password: { 
			type: String,
		}
	}, 
	google: {
		id: {
			type: String
		},
		email: {
			type: String,
			lowercase: true
		}
	}, 
	facebook: {
		id: {
			type: String
		},
		email: {
			type: String,
			lowercase: true
		}
	}
});

userSchema.pre('save', async function(next){
	try {
		// If the sign in method is not local then run the method, if not skip function
		if(this.method !== 'local'){
			next();
		}
		// Generate a Salt
		const salt = await bcrypt.genSalt(10);
		// Generate a password hash (salt + hash);
		const passwordHash = await bcrypt.hash(this.local.password, salt);
		// Re-assing hashed version over original, plain text password
		this.local.password = passwordHash;
		next();
		// console.log('salt', salt);
		// console.log('normal password', this.password);
		// console.log('hashed password', passwordHash);
	} catch(error){
		next(error);
	}
});

userSchema.methods.isValidPassword = async function(userPassword){
	try{
		console.log("this.local.password", this.local.password);
		console.log("users password", userPassword);
		return await bcrypt.compare(userPassword, this.local.password);
	} catch(error){
		throw new Error(error);
	}
}

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
