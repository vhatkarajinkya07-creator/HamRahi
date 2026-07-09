const User = require("../../models/user.model");
const { getDestinationDetails } = require("../../services/destination.service");

const getWishlist = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("wishlist");

        const wishlist = (
            await Promise.all(
                user.wishlist.map(async (placeId) => {
                    try {
                        return await getDestinationDetails(placeId);
                    } catch {
                        return null;
                    }
                })
            )
        ).filter(Boolean);

        return res.status(200).json(wishlist);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });

    }
};

module.exports = getWishlist;