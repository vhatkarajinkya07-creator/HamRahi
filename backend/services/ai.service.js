const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_MODEL } = require("../config/gemini.config");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL
});

const getDestinationTags = async (title, description) => {

    const prompt = `
You are a travel expert.

Return ONLY a JSON array of exactly 5 tags.

Rules:

1. The FIRST tag MUST be exactly one of these:

const PRIMARY_TAGS = [
    "Beaches",
    "Mountains",
    "Cities",
    "Islands",
    "Forests",
    "Deserts",
    "Lakes",
    "Rivers",
    "Waterfalls",
    "Snow Destinations",
    "National Parks",
    "Historical",
    "Religious",
    "Wildlife"
];

2. The remaining four tags should describe the destination.

Examples:

Tokyo
["Cities","Food","Shopping","Culture","Nightlife"]

Manali
["Mountains","Adventure","Snow","Hiking","Nature"]

Goa
["Beaches","Nightlife","Water Sports","Relaxation","Food"]

Dubai
["Deserts","Luxury","Shopping","Architecture","Nightlife"]

Swiss Alps
["Snow Destinations","Mountains","Skiing","Nature","Photography"]

Destination:
${title}

Description:
${description}

Return ONLY JSON.
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    // Remove markdown if Gemini adds it
    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // Extract JSON array only
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
        throw new Error("Gemini didn't return a JSON array");
    }

    text = text.substring(start, end + 1);

    return JSON.parse(text);
};

const getDestinationTagline = async (title, description) => {
    const prompt = `
You are a travel copywriter.

Write ONE catchy travel tagline.

Destination:
${title}

Description:
${description}

Rules:
- Maximum 8 words.
- No quotation marks.
- No emojis.
- Return ONLY the tagline.
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
};

module.exports = {
    getDestinationTags,
    getDestinationTagline
};
