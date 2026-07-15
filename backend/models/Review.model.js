const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    destination: {
      type: String, // placeId
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a user can only review a specific destination once
reviewSchema.index({ user: 1, destination: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
