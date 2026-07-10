const User = require("../../models/user.model");

const removeFromWishlist = async (req, res) => {
    try {

        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                message: "Place ID is required"
            });
        }

        await User.findByIdAndUpdate(
            req.user.id,
            {
                $pull: {
                    wishlist: placeId
                }
            }
        );

        return res.status(200).json({
            message: "Removed from wishlist"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });

    }
};

module.exports = removeFromWishlist;