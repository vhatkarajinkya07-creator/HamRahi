// Profile.jsx — fully dynamic, backend-connected
import { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("dna");
  const [wishlist, setWishlist] = useState([]);
  const [trips, setTrips] = useState([]);
  const [dna, setDna] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [settingsForm, setSettingsForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  // Sync form with user whenever user object updates
  useEffect(() => {
    if (user) {
      setSettingsForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  // Fetch wishlist + trips and compute DNA
  useEffect(() => {
    async function fetchProfileData() {
      setDataLoading(true);
      try {
        const [{ data: wishlistData }, { data: tripsData }] = await Promise.all([
          api.get("/wishlist"),
          api.get("/trips"),
        ]);

        setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        setTrips(Array.isArray(tripsData) ? tripsData : []);

        // Compute DNA from wishlist tags
        const counts = {};
        let total = 0;
        wishlistData.forEach((item) => {
          const tags = item.basicInfo?.tags || [];
          tags.forEach((tag) => {
            const normalized = tag.trim();
            if (!normalized) return;
            counts[normalized] = (counts[normalized] || 0) + 1;
            total++;
          });
        });

        const computedDna =
          total === 0
            ? []
            : Object.entries(counts)
                .map(([name, count]) => ({
                  name,
                  percentage: Math.round((count / total) * 100),
                  count,
                }))
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 6);

        setDna(computedDna);
      } catch (err) {
        console.error("Could not fetch profile data:", err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  // ─── Badges computed from real data ───────────────────────────────────────
  const badges = useMemo(() => {
    const wishlistPlaceIds = new Set(wishlist.map((w) => w.placeId || w.id));
    const tripPlaceIds = new Set(trips.map((t) => t.placeId));
    const allPlaceIds = new Set([...wishlistPlaceIds, ...tripPlaceIds]);

    const placeTags = {};
    wishlist.forEach((w) => {
      placeTags[w.placeId || w.id] = (w.basicInfo?.tags || []).map((t) => t.toLowerCase());
    });
    trips.forEach((t) => {
      if (!placeTags[t.placeId]) {
        placeTags[t.placeId] = [t.destination?.toLowerCase(), t.country?.toLowerCase()].filter(Boolean);
      }
    });

    const countByTag = (...patterns) => {
      let count = 0;
      allPlaceIds.forEach((placeId) => {
        const tags = placeTags[placeId] || [];
        if (patterns.some((p) => tags.some((tag) => tag.includes(p.toLowerCase())))) {
          count++;
        }
      });
      return count;
    };

    const beachCount = countByTag("beach", "island", "coast", "sea");
    const mountainCount = countByTag("mountain", "alpine", "hill", "peak", "trek");
    const cityCount = countByTag("city", "urban", "metro", "capital");
    const forestCount = countByTag("forest", "lake", "river", "waterfall", "park", "jungle");
    const snowCount = countByTag("snow", "winter", "glacier", "arctic");
    const cultureCount = countByTag("history", "religion", "temple", "spiritual", "culture", "heritage", "ancient");
    const wildlifeCount = countByTag("wildlife", "animal", "nature", "safari", "jungle");
    const desertCount = countByTag("desert", "dune", "arid", "sahara");
    const islandCount = countByTag("island", "tropical", "lagoon", "atoll");

    const totalDiaryLogs = trips.reduce((sum, t) => sum + (t.diary?.length || 0), 0);
    const completedTrips = trips.filter((t) => t.status === "completed").length;
    const activeTrips = trips.filter((t) => t.status === "active").length;
    const upcomingTrips = trips.filter((t) => t.status === "upcoming").length;
    const highBudget = trips.filter((t) => t.budget === "High").length;
    const lowBudget = trips.filter((t) => t.budget === "Low").length;
    const soloTrips = trips.filter((t) => t.travelStyle === "Solo").length;
    const socialTrips = trips.filter((t) => ["Friends", "Couple", "Family"].includes(t.travelStyle)).length;
    const uniqueCountries = new Set(trips.map((t) => t.country).filter(Boolean)).size;

    return [
      {
        id: "first-stamp",
        name: "First Stamp",
        description: "Complete your first trip",
        icon: "pi-check-circle",
        color: "text-teal-400 border-teal-400/30 bg-teal-400/10",
        unlocked: completedTrips >= 1,
        progress: `${completedTrips}/1`,
      },
      {
        id: "active-explorer",
        name: "Active Explorer",
        description: "Have at least 1 active trip right now",
        icon: "pi-play-circle",
        color: "text-red-400 border-red-400/30 bg-red-400/10",
        unlocked: activeTrips >= 1,
        progress: `${activeTrips}/1`,
      },
      {
        id: "wishlist-builder",
        name: "Wishlist Builder",
        description: `Add ${wishlist.length}/5 destinations to wishlist`,
        icon: "pi-heart",
        color: "text-pink-400 border-pink-400/30 bg-pink-400/10",
        unlocked: wishlist.length >= 5,
        progress: `${wishlist.length}/5`,
      },
      {
        id: "globetrotter",
        name: "Globetrotter",
        description: `Plan ${trips.length}/5 AI itineraries`,
        icon: "pi-globe",
        color: "text-sky-400 border-sky-400/30 bg-sky-400/10",
        unlocked: trips.length >= 5,
        progress: `${trips.length}/5`,
      },
      {
        id: "world-traveler",
        name: "World Traveler",
        description: `Visit ${uniqueCountries}/3 different countries`,
        icon: "pi-map",
        color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
        unlocked: uniqueCountries >= 3,
        progress: `${uniqueCountries}/3`,
      },
      {
        id: "beach-bum",
        name: "Beach Bum",
        description: `Save/plan ${beachCount}/3 beach or coastal spots`,
        icon: "pi-sun",
        color: "text-amber-400 border-amber-400/30 bg-amber-400/10",
        unlocked: beachCount >= 3,
        progress: `${beachCount}/3`,
      },
      {
        id: "alpine-king",
        name: "Alpine King",
        description: `Save/plan ${mountainCount}/3 mountain destinations`,
        icon: "pi-compass",
        color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
        unlocked: mountainCount >= 3,
        progress: `${mountainCount}/3`,
      },
      {
        id: "urban-legend",
        name: "Urban Legend",
        description: `Save/plan ${cityCount}/3 urban cities`,
        icon: "pi-building",
        color: "text-violet-400 border-violet-400/30 bg-violet-400/10",
        unlocked: cityCount >= 3,
        progress: `${cityCount}/3`,
      },
      {
        id: "deep-forest",
        name: "Deep Forest",
        description: `Save/plan ${forestCount}/3 forest or lake spots`,
        icon: "pi-tree",
        color: "text-green-400 border-green-400/30 bg-green-400/10",
        unlocked: forestCount >= 3,
        progress: `${forestCount}/3`,
      },
      {
        id: "snow-tracker",
        name: "Snow Tracker",
        description: `Save/plan ${snowCount}/2 snow or glacier destinations`,
        icon: "pi-cloud",
        color: "text-blue-300 border-blue-300/30 bg-blue-300/10",
        unlocked: snowCount >= 2,
        progress: `${snowCount}/2`,
      },
      {
        id: "culture-aficionado",
        name: "Culture Aficionado",
        description: `Save/plan ${cultureCount}/3 historic or spiritual spots`,
        icon: "pi-building-columns",
        color: "text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10",
        unlocked: cultureCount >= 3,
        progress: `${cultureCount}/3`,
      },
      {
        id: "nature-lover",
        name: "Nature Lover",
        description: `Save/plan ${wildlifeCount}/2 wildlife or nature spots`,
        icon: "pi-heart-fill",
        color: "text-lime-400 border-lime-400/30 bg-lime-400/10",
        unlocked: wildlifeCount >= 2,
        progress: `${wildlifeCount}/2`,
      },
      {
        id: "desert-ranger",
        name: "Desert Ranger",
        description: `Save/plan ${desertCount}/2 desert destinations`,
        icon: "pi-bolt",
        color: "text-orange-400 border-orange-400/30 bg-orange-400/10",
        unlocked: desertCount >= 2,
        progress: `${desertCount}/2`,
      },
      {
        id: "island-hopper",
        name: "Island Hopper",
        description: `Save/plan ${islandCount}/3 tropical islands`,
        icon: "pi-map-marker",
        color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
        unlocked: islandCount >= 3,
        progress: `${islandCount}/3`,
      },
      {
        id: "travel-writer",
        name: "Travel Writer",
        description: `Write ${totalDiaryLogs}/3 diary entries`,
        icon: "pi-pencil",
        color: "text-rose-400 border-rose-400/30 bg-rose-400/10",
        unlocked: totalDiaryLogs >= 3,
        progress: `${totalDiaryLogs}/3`,
      },
      {
        id: "prolific-writer",
        name: "Prolific Writer",
        description: `Write ${totalDiaryLogs}/10 diary entries`,
        icon: "pi-file-edit",
        color: "text-rose-500 border-rose-500/30 bg-rose-500/10",
        unlocked: totalDiaryLogs >= 10,
        progress: `${totalDiaryLogs}/10`,
      },
      {
        id: "elite-voyageur",
        name: "Elite Voyageur",
        description: `Complete ${completedTrips}/3 journeys`,
        icon: "pi-star",
        color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
        unlocked: completedTrips >= 3,
        progress: `${completedTrips}/3`,
      },
      {
        id: "mega-voyager",
        name: "Mega Voyager",
        description: `Complete ${completedTrips}/5 journeys`,
        icon: "pi-sparkles",
        color: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10",
        unlocked: completedTrips >= 5,
        progress: `${completedTrips}/5`,
      },
      {
        id: "trip-planner",
        name: "Trip Planner",
        description: `Have ${upcomingTrips}/3 upcoming trips at once`,
        icon: "pi-calendar-plus",
        color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
        unlocked: upcomingTrips >= 3,
        progress: `${upcomingTrips}/3`,
      },
      {
        id: "big-spender",
        name: "Big Spender",
        description: "Plan a High-Budget trip",
        icon: "pi-wallet",
        color: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
        unlocked: highBudget >= 1,
        progress: `${highBudget}/1`,
      },
      {
        id: "budget-backpacker",
        name: "Budget Backpacker",
        description: "Plan a Low-Budget trip",
        icon: "pi-percentage",
        color: "text-orange-400 border-orange-400/30 bg-orange-400/10",
        unlocked: lowBudget >= 1,
        progress: `${lowBudget}/1`,
      },
      {
        id: "solo-nomad",
        name: "Solo Nomad",
        description: "Plan a Solo journey",
        icon: "pi-user",
        color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
        unlocked: soloTrips >= 1,
        progress: `${soloTrips}/1`,
      },
      {
        id: "social-traveler",
        name: "Social Traveler",
        description: "Plan a Friends/Couple/Family trip",
        icon: "pi-users",
        color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
        unlocked: socialTrips >= 1,
        progress: `${socialTrips}/1`,
      },
    ];
  }, [wishlist, trips]);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // ─── Settings handlers ────────────────────────────────────────────────────
  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/auth/profile", { name: settingsForm.name, email: settingsForm.email });
      await refreshUser();
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.put("/auth/password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage({ type: "success", text: data.message || "Password changed successfully." });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setSaving(false);
    }
  };

  // ─── DNA color helper ─────────────────────────────────────────────────────
  const dnaColors = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300">
      <div className="mx-auto max-w-[1080px]">

        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-[var(--border-subtle)] pb-8 mb-4">
          <div className="flex items-center gap-5">
            <div className="relative grid h-18 w-18 place-items-center rounded-full bg-gradient-to-br from-[var(--theme-primary)] to-[var(--color-violet)] shadow-lg h-16 w-16">
              <span className="text-2xl font-black text-white">
                {(user?.name || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{user?.name || "Traveler"}</h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              label={theme === "dark" ? "Light Mode" : "Dark Mode"}
              icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
              outlined
              onClick={toggleTheme}
            />
            <Button label="Logout" icon="pi pi-sign-out" severity="danger" onClick={logout} />
          </div>
        </div>

        {/* ── Stats Strip ────────────────────────────────────────────────── */}
        {dataLoading ? (
          <div className="flex justify-center py-4 mb-8">
            <i className="pi pi-spin pi-spinner text-2xl text-[var(--theme-primary)]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Trips", value: trips.length, icon: "pi-map" },
              { label: "Completed", value: trips.filter((t) => t.status === "completed").length, icon: "pi-check-circle" },
              { label: "Wishlist", value: wishlist.length, icon: "pi-heart" },
              { label: "Badges", value: `${unlockedCount}/${badges.length}`, icon: "pi-star" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center gap-3 shadow-sm">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--theme-primary)]/10">
                  <i className={`pi ${icon} text-[var(--theme-primary)]`} />
                </div>
                <div>
                  <p className="text-xl font-black leading-none">{value}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab Nav ────────────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--border-subtle)] mb-8">
          {[
            { key: "dna", label: "Travel DNA" },
            { key: "badges", label: `Travel Passport (${unlockedCount}/${badges.length})` },
            { key: "settings", label: "Settings" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setMessage({ type: "", text: "" }); }}
              className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
                activeTab === key
                  ? "border-[var(--text-primary)] text-[var(--text-primary)] font-bold"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab Contents ───────────────────────────────────────────────── */}
        <div className="min-h-[400px]">

          {/* ── TRAVEL DNA ─────────────────────────────────────────────── */}
          {activeTab === "dna" && (
            <div className="grid gap-6 md:grid-cols-[1fr_380px]">
              <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Your Travel DNA</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 leading-6">
                  Computed from the tags of your wishlist destinations. Save more spots to see your profile evolve.
                </p>

                {dataLoading ? (
                  <div className="flex justify-center py-10">
                    <i className="pi pi-spin pi-spinner text-3xl text-[var(--theme-primary)]" />
                  </div>
                ) : dna.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-secondary)]">
                    <i className="pi pi-heart text-5xl mb-4 block opacity-30" />
                    <p className="text-sm font-semibold">No wishlist data yet</p>
                    <p className="text-xs mt-2 opacity-70">Add destinations to your wishlist to reveal your Travel DNA.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {dna.map((tag, i) => (
                      <div key={tag.name} className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: dnaColors[i % dnaColors.length] }}
                            />
                            <span className="capitalize">{tag.name}</span>
                          </div>
                          <span className="text-[var(--text-secondary)]">{tag.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-base)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${tag.percentage}%`,
                              background: dnaColors[i % dnaColors.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DNA Summary sidebar */}
              <div className="space-y-4">
                <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm">
                  <i className="pi pi-chart-bar text-3xl text-[var(--color-teal)] mb-4 block" />
                  <h3 className="text-xl font-bold mb-3">DNA Summary</h3>
                  {dataLoading ? (
                    <div className="h-16 flex items-center">
                      <i className="pi pi-spin pi-spinner text-[var(--theme-primary)]" />
                    </div>
                  ) : dna.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)] leading-6">
                      Add destinations to your wishlist to get your travel DNA analysis.
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)] leading-6">
                      You lean heavily towards{" "}
                      <strong className="text-[var(--text-primary)] capitalize">{dna[0]?.name}</strong>
                      {dna[1] && (
                        <>
                          {" "}and{" "}
                          <strong className="text-[var(--text-primary)] capitalize">{dna[1]?.name}</strong>
                        </>
                      )}.{" "}
                      {dna.length < 4
                        ? "Add more diverse destinations to refine your travel profile further."
                        : "Your travel palette is wonderfully diverse — keep exploring!"}
                    </p>
                  )}
                </div>

                {/* Quick stats */}
                <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm">
                  <h4 className="font-bold text-sm mb-4 border-b border-[var(--border-subtle)] pb-3">Explorer Stats</h4>
                  {[
                    ["Wishlist Spots", wishlist.length],
                    ["Trips Planned", trips.length],
                    ["Trips Completed", trips.filter((t) => t.status === "completed").length],
                    ["Diary Entries", trips.reduce((s, t) => s + (t.diary?.length || 0), 0)],
                    ["Badges Earned", `${unlockedCount}/${badges.length}`],
                    ["DNA Categories", dna.length],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-xs py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                      <span className="text-[var(--text-secondary)]">{label}</span>
                      <span className="font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TRAVEL PASSPORT (BADGES) ────────────────────────────────── */}
          {activeTab === "badges" && (
            <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Travel Achievements</h2>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-[var(--theme-primary)] text-xl font-black">{unlockedCount}</span>
                  <span className="text-[var(--text-secondary)]">/ {badges.length} unlocked</span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6 leading-6">
                Earn badges automatically by building your wishlist, planning and completing trips, and writing your diary.
              </p>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="w-full h-3 rounded-full bg-[var(--bg-base)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--color-violet)] transition-all duration-700"
                    style={{ width: `${Math.round((unlockedCount / badges.length) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                  {Math.round((unlockedCount / badges.length) * 100)}% of your passport filled
                </p>
              </div>

              {dataLoading ? (
                <div className="flex justify-center py-12">
                  <i className="pi pi-spin pi-spinner text-3xl text-[var(--theme-primary)]" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Show unlocked first, then locked */}
                  {[...badges].sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0)).map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border p-5 flex items-start gap-4 transition-all duration-200 ${
                        badge.unlocked
                          ? `${badge.color} shadow-sm hover:scale-[1.02]`
                          : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/30 opacity-50 grayscale"
                      }`}
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-xl">
                        <i className={`pi ${badge.icon}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm flex items-center gap-1.5 flex-wrap">
                          {badge.name}
                          {badge.unlocked && (
                            <i className="pi pi-verified text-[11px] shrink-0" />
                          )}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-5">{badge.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-block text-[10px] uppercase font-bold tracking-wider opacity-70">
                            {badge.unlocked ? "✓ Unlocked" : `Progress: ${badge.progress}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ────────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Account Details */}
              <form onSubmit={handleSettingsUpdate} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h3 className="text-xl font-bold tracking-tight mb-2">Account Details</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-6">
                  Update your display name. Email editing is locked for account security.
                </p>

                {message.text && activeTab === "settings" && (
                  <Message severity={message.type} text={message.text} className="mb-5 w-full" />
                )}

                <div className="flex flex-col gap-5">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Display Name
                    <InputText
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Email Address
                    <InputText
                      value={settingsForm.email}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    />
                    <span className="text-xs text-[var(--text-secondary)] opacity-70">Email cannot be changed</span>
                  </label>
                  <Button
                    type="submit"
                    label={saving ? "Saving…" : "Save Changes"}
                    icon="pi pi-check"
                    loading={saving}
                    disabled={saving}
                    className="mt-2 justify-center font-bold"
                  />
                </div>
              </form>

              {/* Change Password */}
              <form onSubmit={handlePasswordUpdate} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h3 className="text-xl font-bold tracking-tight mb-2">Change Password</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-6">
                  Choose a strong password of at least 6 characters.
                </p>

                <div className="flex flex-col gap-5">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Current Password
                    <InputText
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    New Password
                    <InputText
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Confirm New Password
                    <InputText
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                  </label>
                  <Button
                    type="submit"
                    label={saving ? "Updating…" : "Change Password"}
                    icon="pi pi-lock"
                    loading={saving}
                    disabled={saving}
                    severity="warning"
                    className="mt-2 justify-center font-bold"
                  />
                </div>
              </form>

              {/* Danger Zone */}
              <div className="md:col-span-2 rounded-[28px] border border-red-400/20 bg-red-400/5 p-6 md:p-8">
                <h3 className="text-lg font-bold text-red-400 mb-2">Session</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Sign out of your account on this device.</p>
                <Button
                  label="Sign Out"
                  icon="pi pi-sign-out"
                  severity="danger"
                  outlined
                  onClick={logout}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
