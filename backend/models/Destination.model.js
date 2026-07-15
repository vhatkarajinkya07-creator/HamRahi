const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
    {
        placeId: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        subtitle: {
            type: String,
            required: true
        },

        location: {
            city: String,
            state: String,
            country: String,
            countryCode: String
        },

        coordinates: {
            latitude: Number,
            longitude: Number
        },

        tagline: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        heroImage: {
            title: String,
            description: String,
            imageUrl: String
        },

        gallery: [
            {
                id: String,
                imageUrl: String,
                thumbnail: String,
                photographer: String,
                photographerProfile: String,
                alt: String
            }
        ],

        stats: {
            rating: {
                type: Number,
                default: 0
            },

            reviewCount: {
                type: Number,
                default: 0
            },

            baselineRating: {
                type: Number,
                default: null
            },

            baselineReviewCount: {
                type: Number,
                default: null
            }
        },
        bestSeason: {
            type: String,
            default: null
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Moderate", "Challenging"]
        },

        estimatedBudget: {
            type: String,
            enum: ["Budget", "Mid-range", "Luxury"]
        },

        weather: {
            temperature: Number,
            windSpeed: Number,
            condition: String,
            icon: String
        },

        nearby: [
            {
                placeId: String,
                title: String,

                coordinates: {
                    latitude: Number,
                    longitude: Number
                },

                metadata: {
                    category: String,
                    wikipedia: String,
                    wikidata: String,
                    website: String
                }
            }
        ],

        discover: {
            featured: {
                type: Boolean,
                default: false
            },

            categories: {
                type: [String],
                default: []
            },

            priority: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Destination", destinationSchema);