const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getDestinationDetails } = require("./destination.service");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const generateItinerary = async ({
    placeId,
    days,
    budget,
    travelStyle,
    interests
}) => {

    const destination = await getDestinationDetails(placeId);

    const description =
        destination.gallery.heroImage.description
            ?.split(".")
            .slice(0, 2)
            .join(".")
            .trim() + ".";

    const prompt = `
You are an expert travel planner.

Generate a personalized, practical and enjoyable travel itinerary.

Destination:
${destination.basicInfo.title}

About Destination:
${description}

Destination Tags:
${destination.basicInfo.tags.join(", ")}

Current Weather:
${destination.weather.temperature}°C
${destination.weather.condition}

Trip Details:

Days: ${days}

Budget: ${budget}

Travel Style: ${travelStyle}

Interests:
${interests.join(", ")}

Return ONLY valid JSON in the following format.

{
    "destination": "",

    "tripSummary": "",

    "estimatedBudget": "",

    "bestTimeToVisit": "",

    "packingEssentials": [],

    "localTips": [],

    "days": [
        {
            "day": 1,

            "title": "",

            "activities": [
                {
                    "time": "Morning",

                    "activity": "",

                    "description": ""
                }
            ]
        }
    ]
}

Rules:

1. Generate exactly ${days} days.

2. Include 4-6 activities for each day.

3. Use only these time slots:
Morning
Late Morning
Afternoon
Evening
Night

4. Arrange activities logically throughout the day.

5. Recommend local food experiences whenever suitable.

6. Suggest transportation whenever helpful.

7. Consider the current weather.

8. Match the specified budget.

9. Match the travel style.

10. Match the listed interests.

11. Avoid repeating attractions.

12. Keep activity descriptions under 30 words.

13. tripSummary should be one exciting paragraph (40-60 words).

14. packingEssentials should contain 6-10 useful items.

15. localTips should contain 4-6 practical travel tips specific to the destination.

16. Return ONLY valid JSON.

17. Do NOT use markdown.

18. Do NOT include explanations.
`;

    const result = await model.generateContent(prompt);

    return JSON.parse(
        result.response
            .text()
            .replace(/```json|```/g, "")
            .trim()
    );
};

module.exports = {
    generateItinerary
};