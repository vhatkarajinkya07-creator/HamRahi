import React from "react";

const DestinationCard = () => {
    const data = {
    "destination": "Tokyo",
    "tripSummary": "Embark on an electrifying 5-day Tokyo adventure with friends! Dive into the city's vibrant pulse, from neon-lit Shinjuku nights and Shibuya's iconic fashion scene to the traditional charm of Asakusa. Indulge in epic culinary journeys, shop till you drop in Harajuku, and experience unforgettable nightlife, all while soaking in Japan's unique culture.",
    "estimatedBudget": "¥150,000 - ¥250,000 per person (excluding flights and major accommodation, based on mid-range options for food, transport, activities, and some shopping/nightlife).",
    "bestTimeToVisit": "Spring (March-May) for cherry blossoms and mild weather, or Autumn (September-November) for comfortable temperatures and vibrant foliage. Shoulder seasons offer pleasant conditions.",
    "packingEssentials": [
        "Comfortable walking shoes (essential for city exploration)",
        "Light layers (t-shirts, light sweater/cardigan for evenings)",
        "Portable power bank (for phone navigation and photos)",
        "Universal travel adapter (Type A/B outlets)",
        "Small backpack or stylish day bag",
        "Compact umbrella (for unexpected showers)",
        "Stylish outfit for nightlife experiences",
        "Cash (many smaller shops/restaurants prefer it)"
    ],
    "localTips": [
        "Get a Suica or Pasmo card for seamless public transport (trains and subways).",
        "Always carry some cash; many smaller eateries and vending machines are cash-only.",
        "Master basic etiquette: no eating/drinking on trains, queueing, and bowing.",
        "Utilize Japan's excellent public transport; taxis are expensive.",
        "Look for 'depachika' (department store basements) for amazing food halls and gourmet souvenirs.",
        "Learn a few basic Japanese phrases like 'Arigato' (thank you) and 'Sumimasen' (excuse me/sorry)."
    ],
    "days": [
        {
            "day": 1,
            "title": "Shinjuku Arrival & Neon Nights",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Arrival & Hotel Check-in",
                    "description": "Arrive in Tokyo, transfer to your hotel in Shinjuku, and settle in. Get ready for an exciting trip!"
                },
                {
                    "time": "Late Morning",
                    "activity": "Shinjuku Gyoen National Garden",
                    "description": "Relax in this tranquil urban oasis. Enjoy diverse landscapes, from Japanese to French gardens. Great for unwinding after travel."
                },
                {
                    "time": "Afternoon",
                    "activity": "Shinjuku Shopping Spree",
                    "description": "Explore department stores like Isetan or Lumine Est. Browse trendy fashion, unique souvenirs, and electronics. Plenty for friends to discover."
                },
                {
                    "time": "Evening",
                    "activity": "Dinner at Omoide Yokocho ('Piss Alley')",
                    "description": "Experience nostalgic Tokyo. Enjoy delicious yakitori, ramen, and other local dishes in atmospheric tiny eateries. Perfect for friends."
                },
                {
                    "time": "Night",
                    "activity": "Golden Gai Bar Hopping",
                    "description": "Dive into Shinjuku's legendary nightlife. Explore hundreds of tiny, quirky bars. Find a cozy spot for drinks and conversation."
                }
            ]
        },
        {
            "day": 2,
            "title": "Shibuya's Buzz & Harajuku's Edge",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Shibuya Crossing & Hachiko",
                    "description": "Witness the world's busiest intersection. Take iconic photos and meet at the famous Hachiko statue. A must-see Tokyo experience."
                },
                {
                    "time": "Late Morning",
                    "activity": "Shibuya Fashion Exploration",
                    "description": "Shop the latest trends at Shibuya 109 and surrounding boutiques. Discover unique Japanese street style and fashion for all budgets."
                },
                {
                    "time": "Afternoon",
                    "activity": "Harajuku's Takeshita Street & Meiji Jingu Shrine",
                    "description": "Immerse yourselves in vibrant youth culture and quirky shops. Then, find serenity at the majestic Meiji Jingu Shrine nearby."
                },
                {
                    "time": "Evening",
                    "activity": "Dinner in Harajuku/Shibuya",
                    "description": "Enjoy a fun dinner. Try a themed cafe, conveyor belt sushi, or a delicious ramen joint. Lots of choices for friends."
                },
                {
                    "time": "Night",
                    "activity": "Karaoke or Themed Bar Experience",
                    "description": "Unleash your inner pop star at a Shibuya karaoke box. Alternatively, visit a unique themed bar for quirky drinks and atmosphere."
                }
            ]
        },
        {
            "day": 3,
            "title": "Foodie Delights & Akihabara's Tech Pulse",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Tsukiji Outer Market Food Tour",
                    "description": "Savor fresh seafood and street food delights like sushi, tamagoyaki, and grilled scallops. A true culinary adventure."
                },
                {
                    "time": "Late Morning",
                    "activity": "Ginza Shopping & Depachika",
                    "description": "Stroll through upscale Ginza for luxury brands and explore magnificent department store food halls (depachika) for gourmet treats."
                },
                {
                    "time": "Afternoon",
                    "activity": "Akihabara: Anime, Manga & Electronics",
                    "description": "Dive into Tokyo's electric town. Explore multi-story electronics stores, anime shops, and retro game arcades. Geek out with friends!"
                },
                {
                    "time": "Evening",
                    "activity": "Dinner in Akihabara",
                    "description": "Enjoy a casual yet delicious dinner. Ramen, gyoza, or a curry house are popular choices here. Fuel up for more fun."
                },
                {
                    "time": "Night",
                    "activity": "Gaming Arcades & Maid Cafe (Optional)",
                    "description": "Challenge each other at legendary arcades like Taito Station. For a unique experience, visit a Maid Cafe (optional, budget dependent)."
                }
            ]
        },
        {
            "day": 4,
            "title": "Traditional Charm & Local Discoveries",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Asakusa's Senso-ji Temple & Nakamise-dori",
                    "description": "Visit Tokyo's oldest temple, Senso-ji. Explore the lively Nakamise-dori market for traditional snacks and souvenirs. Soak in the history."
                },
                {
                    "time": "Late Morning",
                    "activity": "Sumida River Cruise",
                    "description": "Enjoy scenic views of Tokyo's skyline from the Sumida River. A relaxing way to see different parts of the city. (Short loop recommended)."
                },
                {
                    "time": "Afternoon",
                    "activity": "Yanaka Ginza Shopping Street",
                    "description": "Experience a nostalgic, traditional Tokyo shopping street. Sample local snacks, browse charming artisan shops, and enjoy a relaxed pace."
                },
                {
                    "time": "Evening",
                    "activity": "Izakaya Dinner in Ueno",
                    "description": "Head to Ueno and find a lively izakaya. Share small plates, enjoy drinks, and experience a quintessential Japanese dining culture with friends."
                },
                {
                    "time": "Night",
                    "activity": "Explore Ueno's Nightlife",
                    "description": "Discover local bars or pubs around Ueno, perhaps finding a spot for craft beer or Japanese sake. Enjoy casual late-night vibes."
                }
            ]
        },
        {
            "day": 5,
            "title": "Futuristic Visions & Farewell Fun",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Odaiba: TeamLab Planets TOKYO (or VenusFort)",
                    "description": "Immerse yourselves in a breathtaking digital art museum. Alternatively, explore the European-themed VenusFort mall (if TeamLab exceeds budget)."
                },
                {
                    "time": "Late Morning",
                    "activity": "Odaiba Kaihin Koen & Rainbow Bridge Views",
                    "description": "Stroll along the man-made beach. Enjoy spectacular views of the Rainbow Bridge and Tokyo skyline, a great photo opportunity."
                },
                {
                    "time": "Afternoon",
                    "activity": "Shopping at DiverCity Tokyo Plaza",
                    "description": "Visit this popular mall, home to the life-sized Gundam statue. Shop for fashion, souvenirs, and enjoy entertainment options."
                },
                {
                    "time": "Evening",
                    "activity": "Farewell Dinner with City Views",
                    "description": "Enjoy a memorable farewell dinner at a restaurant in Odaiba or nearby Shiodome, offering stunning night views of Tokyo."
                },
                {
                    "time": "Night",
                    "activity": "Last Drinks at a Sky Bar or Favorite Spot",
                    "description": "Sip cocktails at a stylish sky bar in Shinjuku or Shiodome, reminiscing about your Tokyo adventures, or revisit a favorite bar."
                }
            ]
        }
    ]
}
  const {
    destination,
    tripSummary,
    estimatedBudget,
    bestTimeToVisit,
    packingEssentials,
    localTips,
    days,
  } = data || {};

  const dayCount = days?.length || 0;
  const heroImage = `https://source.unsplash.com/featured/?${encodeURIComponent(
    destination || "travel"
  )}`;

  return (
    <div className="group w-full max-w-105 mx-auto rounded-3xl overflow-hidden bg-linear-to-b from-white/6 to-white/2 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.75)] hover:border-white/20">
      {/* Hero Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={heroImage}
          alt={destination || "Destination"}
          className="h-full w-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent" />

        {/* Destination badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] tracking-wide text-white/80 uppercase">
          AI Curated Trip
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-2xl font-semibold text-white tracking-tight leading-tight">
            {destination || "Unknown Destination"}
          </h2>
          <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <i className="pi pi-calendar text-[11px]" />
              {dayCount} Days
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <i className="pi pi-wallet text-[11px]" />
              {estimatedBudget?.split("(")[0]?.trim() || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        {/* Trip Summary */}
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
          {tripSummary}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/4 border border-white/10 backdrop-blur-md py-3 px-2 text-center transition-colors duration-300 hover:bg-white/8">
            <i className="pi pi-calendar text-white/80 text-sm" />
            <span className="text-[11px] text-white/70 leading-tight">
              {dayCount} Days
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/4 border border-white/10 backdrop-blur-md py-3 px-2 text-center transition-colors duration-300 hover:bg-white/8">
            <i className="pi pi-wallet text-white/80 text-sm" />
            <span className="text-[11px] text-white/70 leading-tight line-clamp-2">
              {estimatedBudget?.split("(")[0]?.trim() || "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/4 border border-white/10 backdrop-blur-md py-3 px-2 text-center transition-colors duration-300 hover:bg-white/8">
            <i className="pi pi-sun text-white/80 text-sm" />
            <span className="text-[11px] text-white/70 leading-tight line-clamp-2">
              {bestTimeToVisit?.split(",")[0]?.trim() || "N/A"}
            </span>
          </div>
        </div>

        {/* Packing Essentials */}
        {packingEssentials?.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2.5">
              Packing Essentials
            </h3>
            <div className="flex flex-wrap gap-2">
              {packingEssentials.slice(0, 6).map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Local Tips */}
        {localTips?.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2.5">
              Local Tips
            </h3>
            <ul className="space-y-2">
              {localTips.slice(0, 3).map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-[13px] text-white/65 leading-snug"
                >
                  <i className="pi pi-check-circle text-white/50 text-xs mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-medium py-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:gap-3 active:scale-[0.98]"
        >
          View Itinerary
          <i className="pi pi-arrow-right text-xs transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
