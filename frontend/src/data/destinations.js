// aabhi sab kuch static last mai backend ko call kr kee save kr lenge iss file se (don't change )-AJINKYA

//this page is usefull for backend person and to make mongodb scema and api of logitude and latitude img and all that use AI or somthing in back to fullfill the request  -AJINKYA




export const CATEGORY_THEME = {
  beach: "theme-beach",
  mountain: "theme-mountain",
  desert: "theme-desert",
  forest: "theme-forest",
  snow: "theme-snow",
  urban: "theme-urban",
};

export const destinations = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "Island of a thousand temples",
    description:
    "Emerald rice terraces, cliffside temples, and reef-lined coasts — Bali blends spiritual calm with barefoot adventure at every turn.",
    rating: 4.8,
    reviews: 12840,
    lat: -8.4095,
    lon: 115.1889,
    themeCategory: "beach",
    tags: ["Beaches", "Temples", "Surfing", "Rice Terraces", "Honeymoon"],
    heroImage: "https://picsum.photos/seed/bali-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/bali-1/800/600",
      "https://picsum.photos/seed/bali-2/800/600",
      "https://picsum.photos/seed/bali-3/800/600",
    ],
    priceFrom: 620,
    bestSeason: "Apr — Oct",
  },

  {
    id: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    tagline: "Peaks that touch the clouds",
    description:
    "Glacier trains, alpine lakes, and villages frozen in postcard time.",
    rating: 4.9,
    reviews: 9310,
    lat: 46.5588,
    lon: 8.0,
    themeCategory: "mountain",
    tags: ["Mountains", "Hiking", "Skiing", "Scenic Drives", "Luxury"],
    heroImage: "https://picsum.photos/seed/swiss-alps-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/swiss-alps-1/800/600",
      "https://picsum.photos/seed/swiss-alps-2/800/600",
      "https://picsum.photos/seed/swiss-alps-3/800/600",
    ],
    priceFrom: 1450,
    bestSeason: "Dec — Mar, Jun — Sep",
  },

  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    tagline: "Neon nights, ancient mornings",
    description:
    "Shrines tucked between skyscrapers, bullet trains, and legendary food scenes.",
    rating: 4.9,
    reviews: 21040,
    lat: 35.6762,
    lon: 139.6503,
    themeCategory: "urban",
    tags: ["Cities", "Nightlife", "Street Food", "Shopping", "Architecture"],
    heroImage: "https://picsum.photos/seed/tokyo-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/tokyo-1/800/600",
      "https://picsum.photos/seed/tokyo-2/800/600",
      "https://picsum.photos/seed/tokyo-3/800/600",
    ],
    priceFrom: 1150,
    bestSeason: "Mar — May, Sep — Nov",
  },

  {
    id: "paris",
    name: "Paris",
    country: "France",
    tagline: "A love letter to slow mornings",
    description:
    "Riverside walks, cafés, art museums, and timeless architecture.",
    rating: 4.8,
    reviews: 26720,
    lat: 48.8566,
    lon: 2.3522,
    themeCategory: "urban",
    tags: ["Museums", "Architecture", "Cafés", "Romance", "Culture"],
    heroImage: "https://picsum.photos/seed/paris-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/paris-1/800/600",
      "https://picsum.photos/seed/paris-2/800/600",
      "https://picsum.photos/seed/paris-3/800/600",
    ],
    priceFrom: 890,
    bestSeason: "Apr — Jun, Sep — Oct",
  },

  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    tagline: "Where the ocean turns turquoise",
    description:
    "Overwater villas, coral reefs, and endless tropical horizons.",
    rating: 4.9,
    reviews: 8720,
    lat: 3.2028,
    lon: 73.2207,
    themeCategory: "beach",
    tags: ["Islands", "Scuba Diving", "Luxury", "Honeymoon", "Beaches"],
    heroImage: "https://picsum.photos/seed/maldives-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/maldives-1/800/600",
      "https://picsum.photos/seed/maldives-2/800/600",
      "https://picsum.photos/seed/maldives-3/800/600",
    ],
    priceFrom: 2100,
    bestSeason: "Nov — Apr",
  },

  {
    id: "ladakh",
    name: "Ladakh",
    country: "India",
    tagline: "High-altitude, higher spirit",
    description:
    "Ancient monasteries, mountain passes, and dramatic Himalayan landscapes.",
    rating: 4.7,
    reviews: 5640,
    lat: 34.1526,
    lon: 77.5771,
    themeCategory: "mountain",
    tags: ["Road Trips", "Monasteries", "Trekking", "Stargazing", "Adventure"],
    heroImage: "https://picsum.photos/seed/ladakh-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/ladakh-1/800/600",
      "https://picsum.photos/seed/ladakh-2/800/600",
      "https://picsum.photos/seed/ladakh-3/800/600",
    ],
    priceFrom: 540,
    bestSeason: "May — Sep",
  },

  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    tagline: "Desert gold meets skyline chrome",
    description:
    "Luxury shopping, desert adventures, and futuristic architecture.",
    rating: 4.7,
    reviews: 18410,
    lat: 25.2048,
    lon: 55.2708,
    themeCategory: "desert",
    tags: ["Luxury", "Shopping", "Desert Safari", "Skyscrapers", "Nightlife"],
    heroImage: "https://picsum.photos/seed/dubai-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/dubai-1/800/600",
      "https://picsum.photos/seed/dubai-2/800/600",
      "https://picsum.photos/seed/dubai-3/800/600",
    ],
    priceFrom: 1320,
    bestSeason: "Nov — Mar",
  },

  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    tagline: "Where mountains meet the sea",
    description:
    "Table Mountain, scenic coastlines, vineyards, and wildlife adventures.",
    rating: 4.8,
    reviews: 11240,
    lat: -33.9249,
    lon: 18.4241,
    themeCategory: "beach",
    tags: ["Beaches", "Road Trips", "Photography", "Wildlife", "Mountains"],
    heroImage: "https://picsum.photos/seed/cape-town-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/cape-town-1/800/600",
      "https://picsum.photos/seed/cape-town-2/800/600",
      "https://picsum.photos/seed/cape-town-3/800/600",
    ],
    priceFrom: 950,
    bestSeason: "Nov — Mar",
  },

  {
    id: "banff",
    name: "Banff",
    country: "Canada",
    tagline: "Turquoise lakes and towering peaks",
    description:
    "Glacier-fed lakes, hiking trails, and alpine adventures in the Rockies.",
    rating: 4.9,
    reviews: 8640,
    lat: 51.1784,
    lon: -115.5708,
    themeCategory: "mountain",
    tags: ["Mountains", "Lakes", "Camping", "Wildlife", "Hiking"],
    heroImage: "https://picsum.photos/seed/banff-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/banff-1/800/600",
      "https://picsum.photos/seed/banff-2/800/600",
      "https://picsum.photos/seed/banff-3/800/600",
    ],
    priceFrom: 890,
    bestSeason: "Jun — Sep",
  },

  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    tagline: "Whitewashed cliffs, endless blue",
    description:
    "Volcanic islands, iconic sunsets, and cliffside villages overlooking the sea.",
    rating: 4.8,
    reviews: 15230,
    lat: 36.3932,
    lon: 25.4615,
    themeCategory: "beach",
    tags: ["Sunsets", "Photography", "Islands", "Luxury", "Honeymoon"],
    heroImage: "https://picsum.photos/seed/santorini-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/santorini-1/800/600",
      "https://picsum.photos/seed/santorini-2/800/600",
      "https://picsum.photos/seed/santorini-3/800/600",
    ],
    priceFrom: 980,
    bestSeason: "May — Sep",
  },

  // ------------------ NEW DESTINATIONS ------------------

  {
    id: "iceland",
    name: "Iceland",
    country: "Iceland",
    tagline: "Fire, ice, and northern lights",
    description:
    "Glaciers, geysers, black-sand beaches, and dancing auroras under endless winter skies.",
    rating: 4.9,
    reviews: 7420,
    lat: 64.9631,
    lon: -19.0208,
    themeCategory: "snow",
    tags: ["Northern Lights", "Glaciers", "Road Trips", "Hot Springs", "Adventure"],
    heroImage: "https://picsum.photos/seed/iceland-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/iceland-1/800/600",
      "https://picsum.photos/seed/iceland-2/800/600",
      "https://picsum.photos/seed/iceland-3/800/600",
    ],
    priceFrom: 1580,
    bestSeason: "Jun — Aug, Sep — Mar (auroras)",
  },

  {
    id: "amazon-rainforest",
    name: "Amazon Rainforest",
    country: "Brazil",
    tagline: "The lungs of the planet",
    description:
    "Dense jungle canopies, winding rivers, and wildlife found nowhere else on Earth.",
    rating: 4.6,
    reviews: 3980,
    lat: -3.4653,
    lon: -62.2159,
    themeCategory: "forest",
    tags: ["Wildlife", "Jungle Trekking", "River Cruises", "Eco-Tourism", "Adventure"],
    heroImage: "https://picsum.photos/seed/amazon-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/amazon-1/800/600",
      "https://picsum.photos/seed/amazon-2/800/600",
      "https://picsum.photos/seed/amazon-3/800/600",
    ],
    priceFrom: 780,
    bestSeason: "Jun — Nov",
  },

  {
    id: "new-york",
    name: "New York City",
    country: "United States",
    tagline: "The city that never sleeps",
    description:
    "Iconic skylines, world-class museums, Broadway lights, and food from every corner of the globe.",
    rating: 4.7,
    reviews: 31250,
    lat: 40.7128,
    lon: -74.006,
    themeCategory: "urban",
    tags: ["Cities", "Shopping", "Museums", "Nightlife", "Architecture"],
    heroImage: "https://picsum.photos/seed/new-york-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/new-york-1/800/600",
      "https://picsum.photos/seed/new-york-2/800/600",
      "https://picsum.photos/seed/new-york-3/800/600",
    ],
    priceFrom: 1050,
    bestSeason: "Apr — Jun, Sep — Nov",
  },

  {
    id: "sahara-desert",
    name: "Sahara Desert",
    country: "Morocco",
    tagline: "Golden dunes under a sea of stars",
    description:
    "Camel treks, star-filled skies, and endless rolling dunes at the edge of the world.",
    rating: 4.7,
    reviews: 4210,
    lat: 31.7917,
    lon: -7.0926,
    themeCategory: "desert",
    tags: ["Desert Safari", "Camel Trekking", "Stargazing", "Camping", "Adventure"],
    heroImage: "https://picsum.photos/seed/sahara-desert-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/sahara-desert-1/800/600",
      "https://picsum.photos/seed/sahara-desert-2/800/600",
      "https://picsum.photos/seed/sahara-desert-3/800/600",
    ],
    priceFrom: 610,
    bestSeason: "Oct — Apr",
  },

  {
    id: "queenstown",
    name: "Queenstown",
    country: "New Zealand",
    tagline: "The adventure capital of the world",
    description:
    "Snow-capped peaks, bungee jumps, and lakeside views built for adrenaline and awe alike.",
    rating: 4.9,
    reviews: 6870,
    lat: -45.0312,
    lon: 168.6626,
    themeCategory: "mountain",
    tags: ["Adventure", "Hiking", "Skiing", "Lakes", "Bungee Jumping"],
    heroImage: "https://picsum.photos/seed/queenstown-hero/1600/900",
    gallery: [
      "https://picsum.photos/seed/queenstown-1/800/600",
      "https://picsum.photos/seed/queenstown-2/800/600",
      "https://picsum.photos/seed/queenstown-3/800/600",
    ],
    priceFrom: 1180,
    bestSeason: "Dec — Feb, Jun — Aug",
  },
];
export const getDestinationById = (id) => destinations.find((d) => d.id === id);