const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email :{
		type : String,
		required : true,
		unique : true,
		lowercase : true
	},
	password :{
		type : String,
		required : true
	},
	name :{
		type : String,
		default : ""
	},

	isVerified :{
		type : Boolean,
		default : false
	},
	verificationToken : {
		type : String,
		default : ""
	},
	verificationTokenExpires: {
    	type: Date
	},
	registrationSession: {
		type: String,
		default: null
	},
	googleId: {
		type: String,
		default: null
	},

	provider: {
		type: String,
		enum: ["local", "google"],
		default: "local"
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;