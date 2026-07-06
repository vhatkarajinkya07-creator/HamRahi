const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

const loginUser = async (req, res) => {
	try{
		const { email, password } = req.body;

		if(!email || !password) {
			return res.status(400).json({ message: 'Please provide email and password' });
		}

		const user = await User.findOne({ email });

		if(!user) {
			return res.status(404).json({ message: 'User not found'});
		}

		if (!user.isVerified) {
			return res.status(403).json({
				message: "verify email first"
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch) {
			return res.status(400).json({ message: 'Incorrect Password' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

		res.cookie('token', token, { 
			httpOnly: true,
			maxAge: 30*24*60*60*1000,
			withCredentials: true
		});

		res.status(200).json({ message: 'Login successful', token });
	} catch(err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

const registerUser = async (req, res) => {
	try{
		const { email, password } = req.body;
		if(!email || !password) {
			return res.status(400).json({ message: 'Please provide email and password' });
		}
		const existing = await User.findOne({ email });
		if(existing) {
			return res.status(400).json({ message: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = crypto.randomBytes(32).toString('hex');

		const user = await User.create({ 
			email,
			password: hashedPassword,
			verificationToken,
			isVerified: false
		});

		await sendVerificationEmail(email, verificationToken);

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
		res.cookie('token', token, { 
			httpOnly: true,
			maxAge: 30*24*60*60*1000,
			withCredentials: true
		});
		res.status(201).json({ message: 'Registered , verification email sent', token });
	} catch(err){
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({ verificationToken: token });
		if(!user) {
			return res.status(400).json({ message: 'Invalid token' });
		}
		if(user.isVerified) {
			return res.status(400).json({ message: 'Email already verified' });
		}
		user.isVerified = true;
		user.verificationToken = '';
		await user.save();
		res.status(201).json({ message: 'Email verified successfully' });
	} catch(err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { loginUser, registerUser, verifyEmail };