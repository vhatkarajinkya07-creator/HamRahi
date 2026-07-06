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
	}
});

const User = mongoose.model('User', userSchema);