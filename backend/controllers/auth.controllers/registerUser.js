const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendVerificationEmail = require('../../utils/sendVerificationEmail');

const registerUser = async (req, res) => {
	try{
		const { email, password, name } = req.body;
		if(!name || !email || !password) {
			return res.status(400).json({ message: 'Please provide name,email and password' });
		}
		const existing = await User.findOne({ email });
		if (existing) {

			if (existing.isVerified) {
					return res.status(409).json({
							message: "Email already registered"
					});
			}

			existing.verificationToken = crypto.randomBytes(32).toString("hex");

			existing.verificationTokenExpires = Date.now() + 1000 * 60 * 30;

			existing.registrationSession = crypto.randomBytes(32).toString("hex");

			await existing.save();

			await sendVerificationEmail(
					existing.email,
					existing.verificationToken
			);

			return res.status(200).json({
					message: "Verification email resent",
					registrationSession:
							existing.registrationSession
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const verificationToken = crypto.randomBytes(32).toString('hex');
		const registrationSession = crypto.randomBytes(32).toString('hex');

		const user = await User.create({ 
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpires : Date.now() + 1000 * 60 * 30,
			registrationSession,
			isVerified: false
		});


		await sendVerificationEmail(email, verificationToken);

		res.status(201).json({ 
			message: 'verification email sent', 
			registrationSession
		 });
	} catch(err){
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = registerUser;