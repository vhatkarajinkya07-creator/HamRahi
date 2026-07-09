const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

    } catch (err) {}

    next();
};

module.exports = optionalAuth;