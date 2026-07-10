import { destinations as fallbackDestinations } from "../data/destinations";

const themes = ["beach", "mountain", "urban", "desert", "forest", "snow"];

export function isBackendPlaceId(value) {
  return /^[RWN]\d+$/.test(String(value || ""));
}

function seededImage(seed, size = "1600/900") {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}`;
}

function pickTheme(tags = [], title = "") {
  const text = [...tags, title].join(" ").toLowerCase();

  if (/beach|island|coast|ocean|sea/.test(text)) return "beach";
  if (/mountain|hiking|trek|snow|alps|peak/.test(text)) return "mountain";
  if (/desert|dune|safari/.test(text)) return "desert";
  if (/forest|jungle|wildlife/.test(text)) return "forest";
  if (/ice|glacier|winter/.test(text)) return "snow";
  if (/city|shopping|nightlife|museum|architecture/.test(text)) return "urban";

  return themes[Math.abs(title.length) % themes.length];
}

export function mapDestinationSummary(destination) {
  const placeId = destination.placeId || destination.id;
  const title = destination.title || destination.name || "Unknown destination";
  const subtitle = destination.subtitle || destination.country || "Explore";
  const coordinates = destination.coordinates || {};
  const tags = destination.tags || [destination.category, destination.type].filter(Boolean);
  const fallback = fallbackDestinations.find(
    (item) =>
      item.id === placeId ||
      item.name.toLowerCase() === title.toLowerCase() ||
      item.country.toLowerCase() === subtitle.toLowerCase(),
  );

  return {
    ...(fallback || {}),
    id: placeId,
    placeId,
    name: title,
    country: subtitle,
    tagline: destination.tagline || fallback?.tagline || `Discover ${title} with HamRahi.`,
    description:
      destination.description ||
      fallback?.description ||
      `${title} brings culture, food, weather, nearby places, and trip planning into one simple view.`,
    rating: fallback?.rating || 4.7,
    reviews: fallback?.reviews || 0,
    lat: Number(coordinates.latitude ?? fallback?.lat ?? 0),
    lon: Number(coordinates.longitude ?? fallback?.lon ?? 0),
    themeCategory: fallback?.themeCategory || pickTheme(tags, title),
    tags: tags.length ? tags : fallback?.tags || ["Explore", "Culture", "Travel"],
    heroImage: fallback?.heroImage || seededImage(`${placeId || title}-hero`),
    gallery: fallback?.gallery || [
      seededImage(`${placeId || title}-1`, "800/600"),
      seededImage(`${placeId || title}-2`, "800/600"),
      seededImage(`${placeId || title}-3`, "800/600"),
    ],
    priceFrom: fallback?.priceFrom || 720,
    bestSeason: fallback?.bestSeason || "All year",
  };
}

export function mapDestinationDetails(destination) {
  const basic = destination.basicInfo || {};
  const gallery = destination.gallery || {};
  const hero = gallery.heroImage || {};
  const images = gallery.images || [];
  const stats = destination.stats || {};
  const weather = destination.weather || {};
  const summary = mapDestinationSummary({
    placeId: destination.placeId,
    title: basic.title,
    subtitle: basic.subtitle || basic.location?.country,
    coordinates: basic.coordinates,
    tags: basic.tags,
    tagline: basic.tagline,
    description: hero.description,
  });

  return {
    ...summary,
    country: basic.subtitle || basic.location?.country || summary.country,
    tagline: basic.tagline || summary.tagline,
    description: hero.description || summary.description,
    rating: stats.rating || summary.rating,
    reviews: stats.reviewCount || summary.reviews,
    tags: basic.tags?.length ? basic.tags : summary.tags,
    heroImage: hero.heroImage || summary.heroImage,
    gallery: images.length
      ? images.map((image) => image.imageUrl || image.thumbnail).filter(Boolean)
      : summary.gallery,
    weather,
    nearby: destination.nearby || [],
    raw: destination,
  };
}
