const { OAuth2Client } = require("google-auth-library");
const User = require('../../models/user.model')
const jwt = require('jsonwebtoken')

const googleLogin = async (req,res) =>{
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const {email, name, sub} = payload;

    let user = await User.findOne({
        email
    });

    if (!user) {
        user = await User.create({
            email,
            name,
            googleId: sub,
            provider: "google",
            isVerified: true
        });
    }

    if (
        user.provider === "local" &&
        !user.googleId
    ) {
        user.googleId = sub;

        await user.save();
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        message : "google login done"
    })
}

module.exports = googleLogin;