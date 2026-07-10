const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchDestination } = require("./destination.service");
const DestinationMetaData = require("../models/destinationMetadata.model");
const { GEMINI_MODEL } = require("../config/gemini.config");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL
});

const getTrendingDestinations = async () => {

    const prompt = `
Return ONLY a valid JSON array of exactly 12 travel destination names.

Rules:
- Include a mix of cities, beaches, islands, mountains, historical places and nature destinations.
- Avoid duplicates.
- Use internationally recognized names.
- Return ONLY JSON.
- No markdown.
- No explanation.

Example:

[
    "Tokyo",
    "Paris",
    "Bali"
]
`;

    const result = await model.generateContent(prompt);

    const text = result.response
        .text()
        .replace(/```json|```/g, "")
        .trim();

    const destinationNames = JSON.parse(text);

    const destinations = (
        await Promise.all(
            destinationNames.map(async (name) => {
                try {
                    const results = await searchDestination(name);
                    return results[0] || null;
                } catch {
                    return null;
                }
            })
        )
    ).filter(Boolean);

    return destinations;
};

const getRecommendedDestinations = async (wishlist = []) => {

    const metadata = await DestinationMetaData.find({
        placeId: { $in: wishlist }
    }).select("title tags tagline");

    const metadataText = metadata
        .map(
            (place) => `
Destination: ${place.title}
Tags: ${place.tags.join(", ")}
Tagline: ${place.tagline}
`
        )
        .join("\n");

    const prompt = `
You are an expert travel recommendation system.

The user likes these destinations:

${metadataText}

Recommend EXACTLY 12 travel destinations.

Rules:

1. Recommend destinations similar to the user's interests.
2. Never recommend destinations already present in the wishlist.
3. Include a mix of famous and underrated destinations.
4. Diversify recommendations across countries and continents.
5. Recommend places with similar experiences and vibes.
6. Use internationally recognized English destination names.
7. Return EXACTLY 12 destinations.
8. Return ONLY a valid JSON array.
9. Do NOT use markdown.
10. Do NOT number the list.
11. Do NOT include any explanation.

Example:

[
    "Seoul",
    "Bangkok",
    "Prague",
    "Hallstatt",
    "Interlaken"
]
`;

    const result = await model.generateContent(prompt);

    const destinationNames = JSON.parse(
        result.response
            .text()
            .replace(/```json|```/g, "")
            .trim()
    );

    const destinations = (
        await Promise.all(
            destinationNames.map(async (name) => {
                try {
                    const results = await searchDestination(name);
                    return results[0] || null;
                } catch {
                    return null;
                }
            })
        )
    ).filter(Boolean);

    return destinations;
};

module.exports = {
    getTrendingDestinations,
    getRecommendedDestinations
};
