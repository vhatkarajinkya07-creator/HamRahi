const axios = require("axios");
const { getWikipediaAttraction } = require("./wikipedia.service");

const getNearbyPlaces = async (latitude, longitude) => {

    const radius = 3000;

    const query = `
    [out:json][timeout:25];

    (
      node(around:${radius},${latitude},${longitude})["tourism"="attraction"];
      way(around:${radius},${latitude},${longitude})["tourism"="attraction"];
      relation(around:${radius},${latitude},${longitude})["tourism"="attraction"];

      node(around:${radius},${latitude},${longitude})["tourism"="museum"];
      way(around:${radius},${latitude},${longitude})["tourism"="museum"];
      relation(around:${radius},${latitude},${longitude})["tourism"="museum"];

      node(around:${radius},${latitude},${longitude})["tourism"="gallery"];
      way(around:${radius},${latitude},${longitude})["tourism"="gallery"];
      relation(around:${radius},${latitude},${longitude})["tourism"="gallery"];

      node(around:${radius},${latitude},${longitude})["tourism"="viewpoint"];
      way(around:${radius},${latitude},${longitude})["tourism"="viewpoint"];
      relation(around:${radius},${latitude},${longitude})["tourism"="viewpoint"];

      node(around:${radius},${latitude},${longitude})["historic"];
      way(around:${radius},${latitude},${longitude})["historic"];
      relation(around:${radius},${latitude},${longitude})["historic"];

      node(around:${radius},${latitude},${longitude})["leisure"="park"];
      way(around:${radius},${latitude},${longitude})["leisure"="park"];
      relation(around:${radius},${latitude},${longitude})["leisure"="park"];

      node(around:${radius},${latitude},${longitude})["amenity"="place_of_worship"];
      way(around:${radius},${latitude},${longitude})["amenity"="place_of_worship"];
      relation(around:${radius},${latitude},${longitude})["amenity"="place_of_worship"];
    );

    out center tags;
    `;

    const params = new URLSearchParams();
    params.append("data", query);

    const { data } = await axios.post(
        "https://overpass-api.de/api/interpreter",
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "HamRahi/1.0"
            }
        }
    );

    const unique = new Map();

    for (const place of data.elements) {

        const title =
            place.tags?.["name:en"] ||
            place.tags?.int_name ||
            place.tags?.name;

        if (!title) continue;

        const lat = place.lat ?? place.center?.lat;
        const lon = place.lon ?? place.center?.lon;

        if (lat == null || lon == null) continue;

        const attraction = {
            placeId: `${place.type[0].toUpperCase()}${place.id}`,

            title,

            coordinates: {
                latitude: lat,
                longitude: lon
            },

            metadata: {
                category:
                    place.tags?.tourism ||
                    place.tags?.historic ||
                    place.tags?.leisure ||
                    place.tags?.amenity ||
                    null,

                wikipedia: place.tags?.wikipedia || null,

                wikidata: place.tags?.wikidata || null,

                website: place.tags?.website || null
            }
        };

        const key = attraction.title.toLowerCase();

        if (!unique.has(key)) {
            unique.set(key, attraction);
        }
    }

    let attractions = [...unique.values()];

    attractions = attractions
        .filter(place => place.metadata.wikipedia || place.metadata.wikidata)
        .sort((a, b) => {

            const score = (x) => {
                let s = 0;

                if (x.metadata.wikidata) s += 100;
                if (x.metadata.wikipedia) s += 50;
                if (x.metadata.website) s += 20;

                return s;
            };

            return score(b) - score(a);

        })
        .slice(0, 5);

    const enriched = await Promise.all(

        attractions.map(async (place) => {

            if (!place.metadata.wikipedia) {
                return place;
            }

            const wiki = await getWikipediaAttraction(
                place.metadata.wikipedia
            );

            if (!wiki) {
                return place;
            }

            return {
                ...place,

                title: wiki.title || place.title,

                description: wiki.description,

                heroImage: wiki.heroImage
            };

        })

    );

    return enriched;
};

module.exports = {
    getNearbyPlaces
};