const axios = require("axios");

const getWikipediaSummary = async (title) => {
    try{
        const { data } = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            {
                headers: {
                    "User-Agent": "HamRahi/1.0 (Travel Application)"
                }
            }
        );

        return {
            title: data.title || title,

            description: data.extract || null,

            heroImage:
                data.originalimage?.source ||
                data.thumbnail?.source ||
                null
        };
    } catch(err){
        console.error("Error fetching Wikipedia summary");
        return {
            title,
            description: null,
            heroImage: null
        };
    }
};

const getWikipediaAttraction = async (article) => {
    try {

        const title = article.includes(":")
            ? article.split(":")[1]
            : article;

        const { data } = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );

        return {
            title: data.title,

            description: data.extract,

            heroImage:
                data.originalimage?.source ||
                data.thumbnail?.source ||
                null
        };

    } catch (err) {
        console.error(`Error fetching Wikipedia article for ${article}`);
        return null;

    }
};

module.exports = {
    getWikipediaSummary,
    getWikipediaAttraction
};