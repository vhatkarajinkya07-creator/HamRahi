const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
	try{
		const { email, password } = req.body;

		if(!email || !password) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		const user = await User.findOne({ email });

		if(!user) {
			return res.status(400).json({ message: 'Please provide email and password' });
		}

		if (!user.isVerified) {
			return res.status(403).json({
				message: "verify email first"
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch) {
			return res.status(400).json({ message: 'Please provide email and password' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

		res.cookie('token', token, { 
			httpOnly: true,
			maxAge: 30*24*60*60*1000,
			sameSite: "lax",
			secure: process.env.NODE_ENV === 'production',
		});

		res.status(200).json({ message: 'Login successful'});
	} catch(err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = loginUser