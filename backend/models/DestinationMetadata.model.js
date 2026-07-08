const mongoose = require("mongoose");

const destinationMetadataSchema = new mongoose.Schema(
    {
        placeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        tags: {
            type: [String],
            default: []
        },

        tagline: {
            type: String,
            default: null
        },

        aiDescription: {
            type: String,
            default: null
        },

        bestSeason: {
            type: String,
            default: null
        },

        estimatedBudget: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "DestinationMetadata",
    destinationMetadataSchema
);