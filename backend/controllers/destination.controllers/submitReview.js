const Review = require("../../models/Review.model");
const Destination = require("../../models/Destination.model");

const submitReview = async (req, res) => {
    try {
        const { placeId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        if (!placeId) {
            return res.status(400).json({
                message: "Place ID is required"
            });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({
                message: "Rating must be a number between 1 and 5"
            });
        }

        // Find if user already reviewed
        let review = await Review.findOne({ user: userId, destination: placeId });

        if (review) {
            review.rating = numRating;
            review.comment = comment || "";
            await review.save();
        } else {
            review = new Review({
                user: userId,
                destination: placeId,
                rating: numRating,
                comment: comment || ""
            });
            await review.save();
        }

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

        // Populate user name/email in the returned review object
        const populatedReview = await Review.findById(review._id).populate("user", "name email");

        return res.status(200).json({
            message: "Review submitted successfully",
            review: populatedReview
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = submitReview;
