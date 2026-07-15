const Review = require("../../models/Review.model");

const getReviews = async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                message: "Place ID is required"
            });
        }

        const reviews = await Review.find({ destination: placeId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = getReviews;
