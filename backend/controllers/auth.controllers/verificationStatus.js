const User = require('../../models/user.model');

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

module.exports = verificationStatus