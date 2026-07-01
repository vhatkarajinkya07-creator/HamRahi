// Static demo data — no backend, no APIs. All content is illustrative MVP content.

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
    heroImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=800&auto=format&fit=crop",
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
      "Glacier trains, alpine lakes, and villages frozen in postcard time — the Alps reward every season with a different kind of wonder.",
    rating: 4.9,
    reviews: 9310,
    lat: 46.5588,
    lon: 8.0000,
    themeCategory: "mountain",
    tags: ["Mountains", "Hiking", "Skiing", "Scenic Drives", "Luxury"],
    heroImage:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1508264165352-258db2ebd59b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527489377706-5bf97e608852?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483919164922-b7972a4b4ba0?q=80&w=800&auto=format&fit=crop",
    ],
    priceFrom: 1450,
    bestSeason: "Dec — Mar, Jun — Sep",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    tagline: "Whitewashed cliffs, endless blue",
    description:
      "Sun-bleached villages spill down volcanic cliffs into the Aegean — famous for sunsets that stop entire towns to watch.",
    rating: 4.8,
    reviews: 15230,
    lat: 36.3932,
    lon: 25.4615,
    themeCategory: "beach",
    tags: ["Islands", "Sunset Points", "Fine Dining", "Honeymoon", "Photography Spots"],
    heroImage:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601581875039-e899893d520c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546091785-6783ec5837e5?q=80&w=800&auto=format&fit=crop",
    ],
    priceFrom: 980,
    bestSeason: "May — Sep",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    tagline: "Neon nights, ancient mornings",
    description:
      "Shrines tucked between skyscrapers, bullet trains, and the best street food on the planet — Tokyo moves at its own electric pace.",
    rating: 4.9,
    reviews: 21040,
    lat: 35.6762,
    lon: 139.6503,
    themeCategory: "urban",
    tags: ["Cities", "Street Food", "Nightlife", "Shopping", "Architecture"],
    heroImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop",
    ],
    priceFrom: 1150,
    bestSeason: "Mar — May, Sep — Nov",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    tagline: "Desert gold meets skyline chrome",
    description:
      "From dune safaris at golden hour to the tallest towers on Earth — Dubai is maximalism with a view in every direction.",
    rating: 4.7,
    reviews: 18410,
    lat: 25.2048,
    lon: 55.2708,
    themeCategory: "desert",
    tags: ["Desert Safari", "Skyscrapers", "Luxury", "Shopping", "Nightlife"],
    heroImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop",
    ],
    priceFrom: 1320,
    bestSeason: "Nov — Mar",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    tagline: "A love letter to slow mornings",
    description:
      "Riverside walks, corner bakeries, and world-class art — Paris turns ordinary afternoons into something worth remembering.",
    rating: 4.8,
    reviews: 26720,
    lat: 48.8566,
    lon: 2.3522,
    themeCategory: "urban",
    tags: ["Cities", "Museums", "Cafés", "Architecture", "Romance"],
    heroImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520939817895-152fea31b7e0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541171361261-38b4b23d97cc?q=80&w=800&auto=format&fit=crop",
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
      "Overwater villas, reef sharks in the shallows, and horizons with no edges — the Maldives is barefoot luxury, uninterrupted.",
    rating: 4.9,
    reviews: 8720,
    lat: 3.2028,
    lon: 73.2207,
    themeCategory: "beach",
    tags: ["Islands", "Overwater Villas", "Scuba Diving", "Honeymoon", "Ultra Luxury"],
    heroImage:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601000938259-9fc65b8e9fe4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?q=80&w=800&auto=format&fit=crop",
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
      "Moonscape valleys, ancient monasteries, and roads that climb past 5,000 metres — Ladakh is raw, remote, and unforgettable.",
    rating: 4.7,
    reviews: 5640,
    lat: 34.1526,
    lon: 77.5771,
    themeCategory: "mountain",
    tags: ["Monasteries", "Trekking", "Road Trips", "Stargazing", "Backpacking"],
    heroImage:
      "https://images.unsplash.com/photo-1626016228237-e2d9c5f0f6f0?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1601652638304-6b6ba0937ac9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585516968236-e0e9c7f3f0f4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?q=80&w=800&auto=format&fit=crop",
    ],
    priceFrom: 540,
    bestSeason: "May — Sep",
  },
];

export const getDestinationById = (id) => destinations.find((d) => d.id === id);
