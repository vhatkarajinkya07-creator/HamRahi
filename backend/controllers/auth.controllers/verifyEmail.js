const User = require('../../models/user.model');

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;

		if (
            typeof token !== "string" ||
            token.length !== 64
		) {
            return res.status(400).json({
                message: "Invalid verification token"
            });
		}

		const user = await User.findOne({ verificationToken: token });
		if(!user) {
			return res.status(400).json({ message: 'Invalid token' });
		}
		if(user.isVerified) {
			return res.status(400).json({ message: 'Email already verified' });
		}
		if (
			user.verificationTokenExpires < Date.now()
		) {
            return res.status(400).json({
                message: "Verification link expired"
            });
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpires = undefined;
		await user.save();
		res.status(200).json({ message: 'Email verified successfully' });
	} catch(err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
}

module.exports = verifyEmail