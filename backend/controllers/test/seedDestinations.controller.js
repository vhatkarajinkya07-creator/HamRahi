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
        let backfilled = 0;

        for (const destination of destinations) {

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

                let existing = await Destination.findOne({
                    placeId: searchResult.placeId
                });
                if(!existing) 
                    existing = await Destination.create({
                        placeId: searchResult.placeId,
                        title: searchResult.title,
                        subtitle: searchResult.subtitle,
                        coordinates: searchResult.coordinates,
                        tagline: destination.tagline,
                        tags: destination.tags,
                        stats: {
                            rating: 0,
                            reviewCount: 0
                        },
                        bestSeason: destination.bestSeason,
                        difficulty: destination.difficulty,
                        estimatedBudget: destination.estimatedBudget,
                        discover: destination.discover
                    });
                
                if(
                    !existing.heroImage ||
                    !existing.heroImage.title ||
                    !existing.heroImage.description ||
                    !existing.heroImage.imageUrl
                ){
                    const wiki = await getWikipediaSummary(searchResult.title) 
                    existing.heroImage = {
                        title : wiki.title,
                        description : wiki.description,
                        imageUrl : wiki.heroImage
                    }
                }
                if(!existing.gallery || existing.gallery.length === 0){
                    const imageQuery = [
                        searchResult.title,
                        searchResult.subtitle
                    ]
                        .filter(Boolean)
                        .join(", ");
                    existing.gallery = await getDestinationImages(imageQuery) 
                }
                if(!existing.weather){
                    existing.weather = await getWeather(
                        searchResult.coordinates.latitude,
                        searchResult.coordinates.longitude
                    )
                }
                if(!existing.nearby || existing.nearby.length === 0){
                    existing.nearby = await getNearbyPlaces(
                        searchResult.coordinates.latitude,
                        searchResult.coordinates.longitude
                    )
                }
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
                
                if (
                    !existing.location ||
                    !existing.location.city ||
                    !existing.location.country
                ) {
                    existing.location = {
                        city,
                        state,
                        country,
                        countryCode: null
                    }
                }
                await existing.save() 
                success++
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