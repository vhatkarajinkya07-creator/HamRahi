const axios = require("axios");

const weatherMap = {
    0: { condition: "Clear Sky", icon: "clear" },

    1: { condition: "Mainly Clear", icon: "clear" },

    2: { condition: "Partly Cloudy", icon: "partly_cloudy" },

    3: { condition: "Cloudy", icon: "cloudy" },

    45: { condition: "Fog", icon: "fog" },

    48: { condition: "Fog", icon: "fog" },

    51: { condition: "Light Drizzle", icon: "drizzle" },

    53: { condition: "Drizzle", icon: "drizzle" },

    55: { condition: "Heavy Drizzle", icon: "drizzle" },

    61: { condition: "Light Rain", icon: "rain" },

    63: { condition: "Rain", icon: "rain" },

    65: { condition: "Heavy Rain", icon: "rain" },

    71: { condition: "Light Snow", icon: "snow" },

    73: { condition: "Snow", icon: "snow" },

    75: { condition: "Heavy Snow", icon: "snow" },

    80: { condition: "Rain Showers", icon: "rain" },

    81: { condition: "Rain Showers", icon: "rain" },

    82: { condition: "Heavy Showers", icon: "rain" },

    95: { condition: "Thunderstorm", icon: "storm" }
};

const getWeather = async (latitude, longitude) => {
    try{
        const { data } = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude,
                    longitude,
                    current: [
                        "temperature_2m",
                        "weather_code",
                        "wind_speed_10m"
                    ].join(",")
                }
            }
        );

        const current = data.current;

        const weather =
            weatherMap[current.weather_code] ||
            {
                condition: "Unknown",
                icon: "unknown"
            };

        return {
            temperature: current.temperature_2m,

            windSpeed: current.wind_speed_10m,

            condition: weather.condition,

            icon: weather.icon
        };
    } catch (err) {
        console.error("Error fetching weather data");
        return {
            temperature: null,
            windSpeed: null,
            condition: "Unknown",
            icon: "unknown"
        };
    }
};

module.exports = {
    getWeather
};