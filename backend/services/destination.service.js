const axios = require("axios");
const { getDestinationImages } = require("./unsplash.service");
const { getHeroImage } = require("./wikipedia.service");
const { getWeather } = require("./weather.service");
const {getDestinationTags, getDestinationTagline} = require("./ai.service");
const DestinationMetadata = require("../models/destinationMetadata.model");

const typeMap = {
    relation: "R",
    way: "W",
    node: "N"
};

const allowedCategories = new Set([
    "boundary",
    "place",
    "natural",
    "tourism"
]);

const searchDestination = async (query) => {
    const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: query,
                format: "jsonv2",
                addressdetails: 1,
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
            const search = query.toLowerCase();

            const aStarts = a.display_name.toLowerCase().startsWith(search);
            const bStarts = b.display_name.toLowerCase().startsWith(search);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return 0;
        })
        .map(place => ({
            placeId: `${typeMap[place.osm_type]}${place.osm_id}`,

            title:
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

            category: place.category,
            type: place.type
        }));
};

const getDestinationDetails = async (placeId) => {
    const typePrefix = placeId[0];
    const osmId = placeId.slice(1);

    if (!["R", "W", "N"].includes(typePrefix)) {
        throw new Error("Invalid Place ID");
    }

    const { data } = await axios.get(
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

    const images = await getDestinationImages(imageQuery);
    const heroImage = await getHeroImage(title);

    const weather = await getWeather(
        Number(place.lat),
        Number(place.lon)
    );

    let metadata = await DestinationMetadata.findOne({ placeId });

    if (!metadata) {
        metadata = await DestinationMetadata.create({
            placeId
        });
    }

    if (metadata.tags.length === 0) {

        metadata.tags = await getDestinationTags(
            heroImage.title,
            heroImage.description
        );

        await metadata.save();
    }

    if (!metadata.tagline) {
        metadata.tagline = await getDestinationTagline(
            heroImage.title,
            heroImage.description
        );
        await metadata.save();
    }

    return {
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
            priceFrom: null,
            bestSeason: null
        },

        weather,

    };
};

module.exports = {
    searchDestination,
    getDestinationDetails
};