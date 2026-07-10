const Destination = require("../models/Destination.model");

const getTrendingDestinations = async () => {

    const places = await Destination.find({
        "discover.featured": true
    })
        .sort({
            "discover.priority": -1
        })
        .select("-_id -__v")
        .lean();

    // Group by category (tags[0])
    const buckets = {};

    places.forEach(place => {

        const category = place.tags?.[0] || "Other";

        if (!buckets[category]) {
            buckets[category] = [];
        }

        buckets[category].push(place);
    });

    // Each bucket is already priority-sorted (inherited from the query sort)
    const categories = Object.keys(buckets);

    const result = [];

    let index = 0;

    // Round-robin across categories until we hit 40 or run out
    while (result.length < 40 && categories.some(cat => buckets[cat].length > index)) {

        for (const category of categories) {

            if (result.length >= 40) {
                break;
            }

            const place = buckets[category][index];

            if (place) {
                result.push(place);
            }
        }

        index++;
    }

    return result;
};

const getRecommendedDestinations = async (wishlist = []) => {

    if (!wishlist.length) {
        return getTrendingDestinations();
    }

    const wishlistDestinations = await Destination.find({
        placeId: { $in: wishlist }
    })
        .select("tags location.country location.state")
        .lean();

    const tagFrequency = {};

    const countries = new Set();
    const states = new Set();

    wishlistDestinations.forEach(place => {

        place.tags.forEach(tag => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });

        if (place.location?.country) {
            countries.add(place.location.country);
        }

        if (place.location?.state) {
            states.add(place.location.state);
        }
    });

    const topTags = Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);

    const candidates = await Destination.find({
        placeId: {
            $nin: wishlist
        }
    })
        .select("-_id -__v")
        .lean();

    const scored = candidates.map(place => {

        let score = 0;

        // Tag score
        place.tags.forEach(tag => {
            if (topTags.includes(tag)) {
                score += 3;
            }
        });

        // Same country
        if (countries.has(place.location.country)) {
            score += 2;
        }

        // Same state
        if (
            place.location.state &&
            states.has(place.location.state)
        ) {
            score += 1;
        }

        // Featured destinations get a small boost
        if (place.discover?.featured) {
            score += 1;
        }

        return {
            ...place,
            score
        };
    });

    // Group scored candidates by category before sorting,
    // so recommendations don't collapse into one dominant category
    const scoredBuckets = {};

    scored.forEach(place => {

        const category = place.tags?.[0] || "Other";

        if (!scoredBuckets[category]) {
            scoredBuckets[category] = [];
        }

        scoredBuckets[category].push(place);
    });

    Object.values(scoredBuckets).forEach(bucket => {
        bucket.sort((a, b) => b.score - a.score);
    });

    const scoredCategories = Object.keys(scoredBuckets);

    const recommended = [];

    let sIndex = 0;

    while (recommended.length < 25 && scoredCategories.some(cat => scoredBuckets[cat].length > sIndex)) {

        for (const category of scoredCategories) {

            if (recommended.length >= 25) {
                break;
            }

            const place = scoredBuckets[category][sIndex];

            // Only include if it actually scored something relevant,
            // otherwise fall through to trending fill below
            if (place && place.score > 0) {
                recommended.push(place);
            }
        }

        sIndex++;
    }

    const recommendedIds = new Set(
        recommended.map(place => place.placeId)
    );

    const trendingPool = candidates.filter(place =>
        place.discover?.featured &&
        !recommendedIds.has(place.placeId)
    );

    const trendingBuckets = {};

    trendingPool.forEach(place => {

        const category = place.tags?.[0] || "Other";

        if (!trendingBuckets[category]) {
            trendingBuckets[category] = [];
        }

        trendingBuckets[category].push(place);
    });

    Object.values(trendingBuckets).forEach(bucket => {
        bucket.sort(
            (a, b) =>
                (b.discover?.priority || 0) -
                (a.discover?.priority || 0)
        );
    });

    const trendingCategories = Object.keys(trendingBuckets);

    const trending = [];

    let tIndex = 0;

    while (trending.length < 40 && trendingCategories.some(cat => trendingBuckets[cat].length > tIndex)) {

        for (const category of trendingCategories) {

            if (trending.length >= 40) {
                break;
            }

            const place = trendingBuckets[category][tIndex];

            if (place) {
                trending.push(place);
            }
        }

        tIndex++;
    }

    const result = [...recommended, ...trending];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};

const getSuggestionsByTag = async (tag, limit = 40) => {

    const places = await Destination
        .find({
                tags: { $regex: new RegExp(`^${tag}$`, "i") }
            })
        .sort({
            "discover.priority": -1
        })
        .select("-_id -__v")
        .lean();

    const buckets = {};

    places.forEach(place => {

        const country = place.location?.country || "Other";

        if (!buckets[country]) {
            buckets[country] = [];
        }

        buckets[country].push(place);
    });

    const countries = Object.keys(buckets);

    const result = [];

    let index = 0;

    while (result.length < limit && countries.some(c => buckets[c].length > index)) {

        for (const country of countries) {

            if (result.length >= limit) {
                break;
            }

            const place = buckets[country][index];

            if (place) {
                result.push(place);
            }
        }

        index++;
    }

    return result;
};

module.exports = {
    getTrendingDestinations,
    getRecommendedDestinations,
    getSuggestionsByTag
};