const {
    getTrendingDestinations,
    getRecommendedDestinations
} = require("../../services/discover.service");

const getDiscover = async (req, res) => {
    try {

        let destinations;

        if (!req.user || !req.user.id) {

            destinations = await getTrendingDestinations();

        } else {

            destinations = await getRecommendedDestinations(
                req.user.wishlist
            );

        }

        return res.status(200).json(destinations);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch discover feed"
        });

    }
};

module.exports = getDiscover;