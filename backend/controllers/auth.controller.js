const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

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

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
};

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

		res.status(201).json({ message: 'verification email sent', registrationSession });
	} catch(err){
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

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

const verificationStatus = async (req, res) => {
    try {
        const { registrationSession } = req.query;

				if (
						typeof registrationSession !== "string" ||
						registrationSession.length !== 64
				) {
						return res.status(400).json({
								message: "Invalid registration session"
						});
				}

        const user = await User.findOne({ registrationSession });

        if (!user) {
            return res.status(401).json({
                message: "Invalid session"
            });
        }

        return res.json({
            isVerified: user.isVerified
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const finalizeRegistration = async (req, res) => {
    try {
        const { registrationSession } = req.body;

        if (!registrationSession) {
            return res.status(400).json({
                message: "Registration session is required"
            });
        }
				if (
						typeof registrationSession !== "string" ||
						registrationSession.length !== 64
				) {
						return res.status(400).json({
								message: "Invalid registration session"
						});
				}
        const user = await User.findOne({ registrationSession });

        if (!user) {
            return res.status(401).json({
                message: "Invalid registration session"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        await User.updateOne(
						{ _id: user._id },
						{
								$unset: {
										registrationSession: ""
								}
						}
				);
								
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Registration completed"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { loginUser, logoutUser, registerUser, verifyEmail, verificationStatus, finalizeRegistration };