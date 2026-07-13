const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');

const finaliseRegistration = async (req, res) => {
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

module.exports = finaliseRegistration