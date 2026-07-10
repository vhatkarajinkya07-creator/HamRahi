const axios = require("axios");
const { getDestinationImages } = require("./unsplash.service");
const { getWikipediaAttraction, getWikipediaSummary } = require("./wikipedia.service");
const { getWeather } = require("./weather.service");
const {getDestinationTags, getDestinationTagline} = require("./ai.service");
const Destination = require("../models/Destination.model");
const { getNearbyPlaces } = require("./nearby.service");
const allowedCategories = new Set([
    "boundary",
    "place",
    "natural",
    "tourism"
]);

const typeMap = {
    relation: "R",
    way: "W",
    node: "N"
};

const searchDestination = async (query) => {

    const search = query.trim().toLowerCase();

    const cachedResults = await Destination.find({
        $or: [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                subtitle: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }).lean();

    if (cachedResults.length) {

        const ranked = cachedResults
            .map(place => {

                let score = 0;

                const title = place.title.toLowerCase();
                const subtitle = place.subtitle.toLowerCase();

                if (title === search) score += 100;
                else if (title.startsWith(search)) score += 80;
                else if (title.includes(search)) score += 60;

                if (subtitle.startsWith(search)) score += 40;
                else if (subtitle.includes(search)) score += 20;

                return {
                    ...place,
                    score
                };

            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        return ranked.map(place => ({
            placeId: place.placeId,

            title: place.title,

            subtitle: place.subtitle,

            coordinates: place.coordinates,

            heroImage: place.heroImage.url,

            tags: place.tags
        }));

    }

    const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: query,
                format: "jsonv2",
                addressdetails: 1,
                namedetails: 1,
                "accept-language": "en",
                limit: 20
            },
            headers: {
                "User-Agent": "HamRahi/1.0"
            }
        }
    );

    return data
        .filter(place => allowedCategories.has(place.category))
        .sort((a, b) => {

            const aTitle =
                a.namedetails?.["name:en"] ||
                a.namedetails?.name ||
                a.display_name;

            const bTitle =
                b.namedetails?.["name:en"] ||
                b.namedetails?.name ||
                b.display_name;

            let scoreA = 0;
            let scoreB = 0;

            const titleA = aTitle.toLowerCase();
            const titleB = bTitle.toLowerCase();

            if (titleA === search) scoreA += 100;
            else if (titleA.startsWith(search)) scoreA += 80;
            else if (titleA.includes(search)) scoreA += 60;

            if (titleB === search) scoreB += 100;
            else if (titleB.startsWith(search)) scoreB += 80;
            else if (titleB.includes(search)) scoreB += 60;

            return scoreB - scoreA;

        })
        .map(place => ({

            placeId: `${typeMap[place.osm_type]}${place.osm_id}`,

            title:
                place.namedetails?.["name:en"] ||
                place.namedetails?.name ||
                place.name ||
                place.display_name.split(",")[0],

            subtitle: [
                place.address?.city ||
                place.address?.town ||
                place.address?.village,
                place.address?.state,
                place.address?.country
            ]
                .filter(Boolean)
                .join(", "),

            coordinates: {
                latitude: Number(place.lat),
                longitude: Number(place.lon)
            },

            heroImage: null,

            tags: []

        }));
};

const getDestinationDetails = async (placeId) => {

    const cachedDestination = await Destination.findOne({ placeId }).lean();
    const weather = await getWeather(cachedDestination?.coordinates?.latitude, cachedDestination?.coordinates?.longitude);

    if (cachedDestination) {
        return {
            placeId: cachedDestination.placeId,

            basicInfo: {
                title: cachedDestination.title,
                subtitle: cachedDestination.subtitle,
                coordinates: cachedDestination.coordinates,
                location: cachedDestination.location,
                tagline: cachedDestination.tagline,
                tags: cachedDestination.tags
            },

            gallery: {
                heroImage: {
                    title: cachedDestination.heroImage.title,
                    description: cachedDestination.heroImage.description,
                    heroImage: cachedDestination.heroImage.imageUrl
                },
                images: cachedDestination.gallery
            },

            stats: {
                rating: cachedDestination.stats.rating,
                reviewCount: cachedDestination.stats.reviewCount,
                bestSeason: cachedDestination.stats.bestSeason,
                estimatedBudget: cachedDestination.estimatedBudget,
                difficulty: cachedDestination.difficulty
            },

            weather,

            nearby: {
                attractions: cachedDestination.nearby
            },
            discover: cachedDestination.discover
        };
    }

    const typePrefix = placeId[0];
    const osmId = placeId.slice(1);

    if (!["R", "W", "N"].includes(typePrefix)) {
        throw new Error("Invalid Place ID");
    }

    const data = await nominatimGet(
        "https://nominatim.openstreetmap.org/lookup",
        {
            params: {
                osm_ids: `${typePrefix}${osmId}`,
                format: "jsonv2",
                addressdetails: 1,
                extratags: 1,
                namedetails: 1,
                "accept-language": "en"
            },
            headers: {
                "User-Agent": "HamRahi/1.0"
            }
        }
    );

    if (!data.length) {
        throw new Error("Destination not found");
    }

    const place = data[0];

    const title =
        place.namedetails?.["name:en"] ||
        place.namedetails?.name ||
        place.name ||
        place.display_name.split(",")[0];

    const city =
        place.address?.city ||
        place.address?.town ||
        place.address?.village ||
        null;

    const state = place.address?.state || null;

    const country = place.address?.country || null;

    const imageQuery = [
        title,
        state,
        country
    ]
    .filter(Boolean)
    .join(", ");

    const [images, heroImage, nearbyAttractions] = await Promise.all([
        getDestinationImages(imageQuery),
        getWikipediaSummary(title),
        getNearbyPlaces(Number(place.lat), Number(place.lon))
    ]);

    const [tags, tagline] = await Promise.all([
        getDestinationTags(
            heroImage.title,
            heroImage.description
        ),
        getDestinationTagline(
            heroImage.title,
            heroImage.description
        )
    ]);

    await Destination.create({
        placeId,

        title,

        subtitle: [city, state, country]
            .filter(Boolean)
            .join(", "),

        location: {
            city,
            state,
            country,
            countryCode:
                place.address?.country_code?.toUpperCase() || null
        },

        coordinates: {
            latitude: Number(place.lat),
            longitude: Number(place.lon)
        },

        tagline,

        tags,

        heroImage: {
            title: heroImage.title,
            description: heroImage.description,
            imageUrl: heroImage.heroImage
        },

        gallery: images,

        stats: {
            rating: 0,
            reviewCount: 0,
            priceFrom: null,
        },

        difficulty: null,

        bestSeason: null,

        estimatedBudget: null,

        weather,

        nearby: nearbyAttractions,

        discover: {
            featured: false,
            categories: [],
            priority: 0
        }
    });

    const destination = {
        placeId,

        basicInfo: {
            title,

            subtitle: [city, state, country]
                .filter(Boolean)
                .join(", "),

            coordinates: {
                latitude: Number(place.lat),
                longitude: Number(place.lon)
            },

            location: {
                city,
                state,
                country,
                countryCode:
                    place.address?.country_code?.toUpperCase() || null
            },

            tagline: metadata.tagline,
            tags : metadata.tags,
        }, 

        gallery: {
            heroImage: heroImage ?? null,
            images: images
        } ,
        stats: {
            rating: null,
            reviewCount: 0,
            bestSeason: null,
            estimatedBudget: null,
            difficulty: null
        },

        weather,
        nearby: {
            attractions: nearbyAttractions
        },
        discover
    };

    destinationDetailsCache.set(`destination:${placeId}`, {
        data: destination,
        createdAt: Date.now()
    });

    return destination;
};

module.exports = {
    searchDestination,
    getDestinationDetails
};
