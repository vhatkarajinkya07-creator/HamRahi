const axios = require("axios");
const { getDestinationImages } = require("./unsplash.service");
const { getWikipediaAttraction, getWikipediaSummary } = require("./wikipedia.service");
const { getWeather } = require("./weather.service");
const {getDestinationTags, getDestinationTagline} = require("./ai.service");
const DestinationMetadata = require("../models/destinationMetadata.model");
const { getNearbyPlaces } = require("./nearby.service");

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

const NOMINATIM_MIN_INTERVAL_MS = Number(process.env.NOMINATIM_MIN_INTERVAL_MS || 1200);
const NOMINATIM_CACHE_TTL_MS = Number(process.env.NOMINATIM_CACHE_TTL_MS || 60 * 60 * 1000);
const nominatimCache = new Map();
const destinationDetailsCache = new Map();

let nominatimQueue = Promise.resolve();
let lastNominatimRequestAt = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cacheKey = (url, params = {}) => {
    const orderedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    return `${url}:${JSON.stringify(orderedParams)}`;
};

const getCachedNominatimResponse = (key) => {
    const cached = nominatimCache.get(key);

    if (!cached) return null;

    if (Date.now() - cached.createdAt > NOMINATIM_CACHE_TTL_MS) {
        nominatimCache.delete(key);
        return null;
    }

    return cached.data;
};

const getCachedDestinationResponse = (key) => {
    const cached = destinationDetailsCache.get(key);

    if (!cached) return null;

    if (Date.now() - cached.createdAt > NOMINATIM_CACHE_TTL_MS) {
        destinationDetailsCache.delete(key);
        return null;
    }

    return cached.data;
};

const createRateLimitError = () => {
    const err = new Error("Map provider rate limit reached. Please wait a few seconds and try again.");
    err.statusCode = 429;
    return err;
};

const safeCall = async (fn, fallback) => {
    try {
        const value = await fn();
        return value ?? fallback;
    } catch (err) {
        console.warn(err.message);
        return fallback;
    }
};

const nominatimGet = async (url, options) => {
    const key = cacheKey(url, options.params);
    const cached = getCachedNominatimResponse(key);

    if (cached) return cached;

    const runRequest = async () => {
        const waitFor = NOMINATIM_MIN_INTERVAL_MS - (Date.now() - lastNominatimRequestAt);

        if (waitFor > 0) {
            await sleep(waitFor);
        }

        lastNominatimRequestAt = Date.now();

        try {
            const { data } = await axios.get(url, {
                timeout: 10000,
                ...options
            });

            nominatimCache.set(key, {
                data,
                createdAt: Date.now()
            });

            return data;
        } catch (err) {
            if (err.response?.status === 429) {
                throw createRateLimitError();
            }

            throw err;
        }
    };

    const queuedRequest = nominatimQueue.then(runRequest, runRequest);
    nominatimQueue = queuedRequest.catch(() => {});

    return queuedRequest;
};

const searchDestination = async (query) => {
    const data = await nominatimGet(
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
                place.namedetails?.["name:en"] ||
                place.namedetails?.int_name ||
                place.namedetails?.name ||
                place.display_name.split(",")[0],


            subtitle:  place.display_name,

            coordinates: {
                latitude: Number(place.lat),
                longitude: Number(place.lon)
            },

            category: place.category,
            type: place.type
        }));
};

const getDestinationDetails = async (placeId) => {
    const cachedDestination = getCachedDestinationResponse(`destination:${placeId}`);

    if (cachedDestination) {
        return cachedDestination;
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

    const [images, heroImage, weather, nearbyAttractions] = await Promise.all([
        safeCall(() => getDestinationImages(imageQuery), []),
        safeCall(() => getWikipediaSummary(title), {
            title,
            description: place.display_name,
            heroImage: null
        }),
        safeCall(() => getWeather(Number(place.lat), Number(place.lon)), null),
        safeCall(() => getNearbyPlaces(Number(place.lat), Number(place.lon)), [])
    ]);

    let metadata = await safeCall(
        () => DestinationMetadata.findOne({ placeId }),
        null
    );

    if (!metadata) {
        metadata = await safeCall(
            () => DestinationMetadata.create({ placeId }),
            {
                placeId,
                title,
                tags: [],
                tagline: ""
            }
        );
    }

    if (!metadata.title) {

        metadata.title = heroImage.title || title;

        await safeCall(() => metadata.save?.(), null);
    }

    if (!metadata.tags || metadata.tags.length === 0) {

        metadata.tags = await safeCall(
            () => getDestinationTags(
                heroImage.title || title,
                heroImage.description || place.display_name
            ),
            ["Cities", "Culture", "Food", "Nature", "Travel"]
        );

        await safeCall(() => metadata.save?.(), null);
    }

    if (!metadata.tagline) {
        metadata.tagline = await safeCall(
            () => getDestinationTagline(
                heroImage.title || title,
                heroImage.description || place.display_name
            ),
            `Discover ${title}`
        );
        await safeCall(() => metadata.save?.(), null);
    }

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
            priceFrom: null,
            bestSeason: null
        },

        weather,
        nearby: {
            attractions: nearbyAttractions
        }
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
