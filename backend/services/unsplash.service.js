const axios = require("axios");

const getDestinationImages = async (query) => {
    const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
            params: {
                query,
                per_page: 5
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        }
    );

    return response.data.results.map((image) => ({
        id: image.id,
        imageUrl: image.urls.regular,
        thumbnail: image.urls.small,
        photographer: image.user.name,
        photographerProfile: image.user.links.html,
        alt: image.alt_description
    }));
};

module.exports = {
    getDestinationImages
};