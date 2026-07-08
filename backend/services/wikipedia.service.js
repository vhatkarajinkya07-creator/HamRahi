const axios = require("axios");

const getHeroImage = async (title) => {
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
};

module.exports = {
    getHeroImage
};