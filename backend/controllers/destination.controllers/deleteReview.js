const Review = require("../../models/Review.model");
const Destination = require("../../models/Destination.model");

const deleteReview = async (req, res) => {
    try {
        const { placeId, reviewId } = req.params;
        const userId = req.user.id;

        if (!placeId || !reviewId) {
            return res.status(400).json({
                message: "Place ID and Review ID are required"
            });
        }

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.status(404).json({
                message: "Review not found or unauthorized"
            });
        }

        await Review.deleteOne({ _id: reviewId });

        // Recalculate average rating and reviewCount for Destination
        const reviews = await Review.find({ destination: placeId });
        const userReviewsCount = reviews.length;
        const userReviewsSum = reviews.reduce((sum, r) => sum + r.rating, 0);

        let destinationObj = await Destination.findOne({ placeId });
        if (destinationObj) {
            let baselineRating = destinationObj.stats.baselineRating;
            let baselineCount = destinationObj.stats.baselineReviewCount;

            if (baselineRating === undefined || baselineRating === null) {
                baselineRating = destinationObj.stats.rating || 4.7;
                baselineCount = destinationObj.stats.reviewCount || 0;
                destinationObj.stats.baselineRating = baselineRating;
                destinationObj.stats.baselineReviewCount = baselineCount;
            }

            const totalCount = baselineCount + userReviewsCount;
            const totalSum = (baselineRating * baselineCount) + userReviewsSum;
            const newRating = totalCount > 0 ? Number((totalSum / totalCount).toFixed(1)) : baselineRating;

            destinationObj.stats.rating = newRating;
            destinationObj.stats.reviewCount = totalCount;
            await destinationObj.save();
        }

        return res.status(200).json({
            message: "Review deleted successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = deleteReview;
