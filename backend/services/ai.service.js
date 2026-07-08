const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const getDestinationTags = async (title, description) => {

    const prompt = `
You are a travel expert.

Return ONLY a JSON array.

Example:
["City","Food","Culture","Shopping","Nightlife"]

Destination:
${title}

Description:
${description}
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