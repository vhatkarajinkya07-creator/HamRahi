const fs = require("fs");
const path = require("path");

const Destination = require("../../models/Destination.model");

const { searchDestination } = require("../../services/destination.service");
const { getWikipediaSummary } = require("../../services/wikipedia.service");
const { getDestinationImages } = require("../../services/unsplash.service");
const { getWeather } = require("../../services/weather.service");
const { getNearbyPlaces } = require("../../services/nearby.service");

const seedDestinations = async (req, res) => {

    try {

        const destinations = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../../data/destinations.json"),
                "utf8"
            )
        );

        const failed = [];

        let success = 0;
        let skipped = 0;
        let backfilled = 0;

        for (const destination of destinations) {

            const existingDoc = await Destination.findOne({
                title: destination.title
            });

            if (existingDoc) {

                if (existingDoc.bestSeason !== destination.bestSeason) {

                    existingDoc.bestSeason = destination.bestSeason;

                    await existingDoc.save();

                    backfilled++;

                    console.log(`↺ Backfilled bestSeason for ${destination.title}`);

                }

                skipped++;

                console.log(`Skipping ${destination.title}`);

                continue;
            }

            try {

                console.log(`Processing ${destination.title}`);

                const searchResults = await searchDestination(destination.title);

                if (!searchResults.length) {

                    failed.push({
                        title: destination.title,
                        reason: "Search failed"
                    });

                    continue;
                }

                const searchResult = searchResults[0];

                const existingByPlaceId = await Destination.findOne({
                    placeId: searchResult.placeId
                });

                if (existingByPlaceId) {

                    if (existingByPlaceId.bestSeason !== destination.bestSeason) {

                        existingByPlaceId.bestSeason = destination.bestSeason;

                        await existingByPlaceId.save();

                        backfilled++;

                        console.log(`↺ Backfilled bestSeason for ${destination.title}`);

                    }

                    console.log(`${destination.title} already exists`);

                    skipped++;

                    continue;
                }

                const imageQuery = [
                    searchResult.title,
                    searchResult.subtitle
                ]
                    .filter(Boolean)
                    .join(", ");

                const [
                    heroImage,
                    gallery,
                    weather,
                    nearby
                ] = await Promise.all([

                    getWikipediaSummary(searchResult.title),

                    getDestinationImages(imageQuery),

                    getWeather(
                        searchResult.coordinates.latitude,
                        searchResult.coordinates.longitude
                    ),

                    getNearbyPlaces(
                        searchResult.coordinates.latitude,
                        searchResult.coordinates.longitude
                    )

                ]);

                const subtitleParts = searchResult.subtitle
                    .split(",")
                    .map(part => part.trim());

                const country = subtitleParts.at(-1) || null;

                const state =
                    subtitleParts.length >= 2
                        ? subtitleParts.at(-2)
                        : null;

                const city =
                    subtitleParts.length >= 3
                        ? subtitleParts[0]
                        : searchResult.title;

                await Destination.create({

                    placeId: searchResult.placeId,

                    title: searchResult.title,

                    subtitle: searchResult.subtitle,

                    location: {
                        city,
                        state,
                        country,
                        countryCode: null
                    },

                    coordinates: searchResult.coordinates,

                    tagline: destination.tagline,

                    tags: destination.tags,

                    heroImage: {
                        title: heroImage.title,
                        description: heroImage.description,
                        imageUrl: heroImage.heroImage
                    },

                    gallery,

                    stats: {
                        rating: 0,
                        reviewCount: 0
                    },

                    bestSeason: destination.bestSeason,

                    difficulty: destination.difficulty,

                    estimatedBudget: destination.estimatedBudget,

                    weather,

                    nearby,

                    discover: destination.discover

                });

                success++;

                console.log(`✔ ${destination.title}`);

                // Nominatim rate limit
                await new Promise(resolve =>
                    setTimeout(resolve, 1200)
                );

            }

            catch (err) {

                console.log(err);

                failed.push({
                    title: destination.title,
                    reason: err.message
                });

            }

        }

        return res.status(200).json({

            total: destinations.length,

            success,

            skipped,

            backfilled,

            failedCount: failed.length,

            failed

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });

    }

};

module.exports = seedDestinations;