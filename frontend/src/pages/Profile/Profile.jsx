// Profile.jsx
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

  const [activeTab, setActiveTab] = useState("dna"); // dna | settings | badges
  const [wishlist, setWishlist] = useState([]);
  const [trips, setTrips] = useState([]);
  const [dna, setDna] = useState([]);
  const [settingsForm, setSettingsForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setSettingsForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const { data: wishlistData } = await api.get("/wishlist");
        setWishlist(wishlistData);

        const { data: tripsData } = await api.get("/trips");
        setTrips(tripsData);

        // Count occurrences of tags
        const counts = {};
        let total = 0;
        wishlistData.forEach((item) => {
          const tags = item.basicInfo?.tags || [];
          tags.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
            total++;
          });
        });

        // Translate to percentages & sort top 5
        const computedDna = Object.entries(counts)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        setDna(computedDna);
      } catch (err) {
        console.error("Could not fetch profile dashboard data:", err);
      }
    }
    fetchProfileData();
  }, []);

  const badges = useMemo(() => {
    // Collect all unique placeIds the user has interacted with (wishlist or trips)
    const wishlistPlaceIds = new Set(wishlist.map(w => w.placeId || w.id));
    const tripPlaceIds = new Set(trips.map(t => t.placeId));
    
    // Combine placeIds
    const allPlaceIds = new Set([...wishlistPlaceIds, ...tripPlaceIds]);
    
    // Combine destination tags
    const placeTags = {};
    wishlist.forEach(w => {
      const tags = w.basicInfo?.tags || [];
      placeTags[w.placeId || w.id] = tags.map(t => t.toLowerCase());
    });
    
    trips.forEach(t => {
      if (!placeTags[t.placeId]) {
        // Safe defaults for trips tag guessing
        placeTags[t.placeId] = [t.destination.toLowerCase(), t.country?.toLowerCase() || ""].filter(Boolean);
      }
    });

    const countByTag = (tagPattern) => {
      let count = 0;
      allPlaceIds.forEach(placeId => {
        const tags = placeTags[placeId] || [];
        if (tags.some(tag => tag.includes(tagPattern.toLowerCase()))) {
          count++;
        }
      });
      return count;
    };

    const beachCount = countByTag("beach") || countByTag("island");
    const mountainCount = countByTag("mountain");
    const cityCount = countByTag("cit") || countByTag("urban");
    const forestCount = countByTag("forest") || countByTag("lake") || countByTag("river") || countByTag("waterfall") || countByTag("park");
    const snowCount = countByTag("snow") || countByTag("winter");
    
    // Custom tag count helpers for extra achievements
    const cultureCount = countByTag("histor") + countByTag("relig") + countByTag("templ") + countByTag("spirit") + countByTag("culture");
    const natureCount = countByTag("wildlife") + countByTag("animal") + countByTag("nature");

    const totalDiaryLogs = trips.reduce((sum, t) => sum + (t.diary?.length || 0), 0);
    const completedTripsCount = trips.filter(t => t.status === "completed").length;
    const activeTripsCount = trips.filter(t => t.status === "active").length;
    
    const highBudgetCount = trips.filter(t => t.budget === "High").length;
    const lowBudgetCount = trips.filter(t => t.budget === "Low").length;
    const soloTravelCount = trips.filter(t => t.travelStyle === "Solo").length;
    const socialTravelCount = trips.filter(t => ["Friends", "Couple", "Family"].includes(t.travelStyle)).length;

    return [
      {
        id: "beach-bum",
        name: "Beach Bum",
        description: `Saved or planned ${beachCount}/3 beach destinations`,
        icon: "pi-sun",
        color: "text-amber-400 border-amber-400/20 bg-amber-400/5",
        unlocked: beachCount >= 3
      },
      {
        id: "alpine-king",
        name: "Alpine King",
        description: `Saved or planned ${mountainCount}/3 mountain destinations`,
        icon: "pi-compass",
        color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
        unlocked: mountainCount >= 3
      },
      {
        id: "urban-legend",
        name: "Urban Legend",
        description: `Saved or planned ${cityCount}/3 urban cities`,
        icon: "pi-building",
        color: "text-violet-400 border-violet-400/20 bg-violet-400/5",
        unlocked: cityCount >= 3
      },
      {
        id: "deep-forest",
        name: "Deep Forest",
        description: `Saved or planned ${forestCount}/3 nature & forest spots`,
        icon: "pi-palette",
        color: "text-teal-400 border-teal-400/20 bg-teal-400/5",
        unlocked: forestCount >= 3
      },
      {
        id: "snow-tracker",
        name: "Snow Tracker",
        description: `Saved or planned ${snowCount}/3 snow destinations`,
        icon: "pi-cloud",
        color: "text-sky-400 border-sky-400/20 bg-sky-400/5",
        unlocked: snowCount >= 3
      },
      {
        id: "cultural-aficionado",
        name: "Culture Aficionado",
        description: `Saved or planned ${cultureCount}/3 historic or spiritual spots`,
        icon: "pi-images",
        color: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5",
        unlocked: cultureCount >= 3
      },
      {
        id: "nature-lover",
        name: "Nature Lover",
        description: `Saved or planned ${natureCount}/3 wildlife or nature sanctuaries`,
        icon: "pi-heart-fill",
        color: "text-green-400 border-green-400/20 bg-green-400/5",
        unlocked: natureCount >= 3
      },
      {
        id: "globetrotter",
        name: "Globetrotter",
        description: `Plan ${trips.length}/5 AI itineraries`,
        icon: "pi-globe",
        color: "text-sky-400 border-sky-400/20 bg-sky-400/5",
        unlocked: trips.length >= 5
      },
      {
        id: "travel-writer",
        name: "Travel Writer",
        description: `Write ${totalDiaryLogs}/3 travel diary logs`,
        icon: "pi-pencil",
        color: "text-rose-400 border-rose-400/20 bg-rose-400/5",
        unlocked: totalDiaryLogs >= 3
      },
      {
        id: "prolific-writer",
        name: "Prolific Writer",
        description: `Write ${totalDiaryLogs}/5 travel diary logs`,
        icon: "pi-file-edit",
        color: "text-rose-500 border-rose-500/20 bg-rose-500/5",
        unlocked: totalDiaryLogs >= 5
      },
      {
        id: "first-stamp",
        name: "First Stamp",
        description: "Complete your first trip",
        icon: "pi-check",
        color: "text-teal-400 border-teal-400/20 bg-teal-400/5",
        unlocked: completedTripsCount >= 1
      },
      {
        id: "active-explorer",
        name: "Active Explorer",
        description: "Have at least 1 active trip in progress",
        icon: "pi-play",
        color: "text-red-400 border-red-400/20 bg-red-400/5",
        unlocked: activeTripsCount >= 1
      },
      {
        id: "elite-voyageur",
        name: "Elite Voyageur",
        description: `Complete ${completedTripsCount}/3 travel journeys`,
        icon: "pi-star",
        color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
        unlocked: completedTripsCount >= 3
      },
      {
        id: "mega-voyager",
        name: "Mega Voyager",
        description: `Complete ${completedTripsCount}/5 travel journeys`,
        icon: "pi-sparkles",
        color: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5",
        unlocked: completedTripsCount >= 5
      },
      {
        id: "big-spender",
        name: "Big Spender",
        description: "Plan a High-Budget trip",
        icon: "pi-wallet",
        color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
        unlocked: highBudgetCount >= 1
      },
      {
        id: "budget-backpacker",
        name: "Budget Backpacker",
        description: "Plan a Low-Budget trip",
        icon: "pi-percentage",
        color: "text-orange-400 border-orange-400/20 bg-orange-400/5",
        unlocked: lowBudgetCount >= 1
      },
      {
        id: "solo-nomad",
        name: "Solo Nomad",
        description: "Plan a Solo travel style journey",
        icon: "pi-user",
        color: "text-purple-400 border-purple-400/20 bg-purple-400/5",
        unlocked: soloTravelCount >= 1
      },
      {
        id: "social-traveler",
        name: "Social Traveler",
        description: "Plan a trip with Friends, Couple, or Family",
        icon: "pi-users",
        color: "text-blue-400 border-blue-400/20 bg-blue-400/5",
        unlocked: socialTravelCount >= 1
      }
    ];
  }, [wishlist, trips]);

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.put("/auth/profile", {
        name: settingsForm.name,
        email: settingsForm.email
      });
      await refreshUser();
      setMessage({ type: "success", text: data.message || "Profile details updated successfully." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile details." });
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
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.put("/auth/password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: "success", text: data.message || "Password changed successfully." });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300">
      <div className="mx-auto max-w-[1080px]">
        
        {/* Header Summary */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/[0.08] border border-[var(--border-subtle)] shadow-sm">
              <i className="pi pi-user text-3xl text-[var(--text-secondary)]" />
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

        {/* Tab Controls */}
        <div className="flex border-b border-[var(--border-subtle)] mb-8">
          <button
            onClick={() => { setActiveTab("dna"); setMessage({ type: "", text: "" }); }}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "dna"
                ? "border-[var(--text-primary)] text-[var(--text-primary)] font-bold"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Travel DNA
          </button>
          <button
            onClick={() => { setActiveTab("badges"); setMessage({ type: "", text: "" }); }}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "badges"
                ? "border-[var(--text-primary)] text-[var(--text-primary)] font-bold"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Travel Passport
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setMessage({ type: "", text: "" }); }}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "settings"
                ? "border-[var(--text-primary)] text-[var(--text-primary)] font-bold"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          
          {/* Tab 1: Travel DNA */}
          {activeTab === "dna" && (
            <div className="grid gap-8 md:grid-cols-[1fr_400px]">
              <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Your Travel DNA</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 leading-6">
                  Calculated dynamically from the tags of items in your active wishlist. Grow your dashboard items to refine your travel profiles.
                </p>

                {dna.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-secondary)]">
                    <i className="pi pi-sparkles text-4xl mb-3 block opacity-50" />
                    <p className="text-sm">Save some destinations to your wishlist to analyze your DNA.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {dna.map((tag) => (
                      <div key={tag.name} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{tag.name}</span>
                          <span className="text-[var(--text-secondary)]">{tag.percentage}%</span>
                        </div>
                        <ProgressBar value={tag.percentage} showValue={false} style={{ height: "8px", borderRadius: "999px" }} className="bg-[var(--bg-base)]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm flex flex-col justify-center">
                <i className="pi pi-chart-bar text-4xl text-[var(--color-teal)] mb-4 block" />
                <h3 className="text-xl font-bold mb-2">DNA Summary</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-6">
                  Based on your saved spots, you lean heavily towards{" "}
                  <strong className="text-[var(--text-primary)]">
                    {dna[0]?.name || "discovering new horizons"}
                  </strong>
                  . Add more destinations across mountain ranges, urban skylines, and pristine beaches to diversify your map stamp stats.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Passport Badges */}
          {activeTab === "badges" && (
            <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Travel Achievements</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-8 leading-6">
                Earn unique badges automatically by completing trips, writing diaries, and mapping your exploration statistics.
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                      badge.unlocked
                        ? `${badge.color} opacity-100 shadow-sm hover:scale-[1.01]`
                        : "border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 opacity-55"
                    }`}
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-xl">
                      <i className={`pi ${badge.icon}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-md flex items-center gap-1.5">
                        {badge.name}
                        {badge.unlocked && <i className="pi pi-verified text-[11px]" />}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-5">{badge.description}</p>
                      <span className="inline-block mt-3 text-[10px] uppercase font-bold tracking-wider opacity-60">
                        {badge.unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Profile Settings */}
          {activeTab === "settings" && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Account Settings form */}
              <form onSubmit={handleSettingsUpdate} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h3 className="text-xl font-bold tracking-tight mb-6">Account Details</h3>
                
                {message.text && activeTab === "settings" && (
                  <Message severity={message.type} text={message.text} className="mb-5 w-full" />
                )}

                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Display Name
                    <InputText
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Email Address
                    <InputText
                      value={settingsForm.email}
                      disabled
                      className="opacity-60 cursor-not-allowed"
                    />
                  </label>
                  <Button type="submit" label="Save settings" icon="pi pi-check" loading={saving} className="mt-4 justify-center font-bold" />
                </div>
              </form>

              {/* Password update form */}
              <form onSubmit={handlePasswordUpdate} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                <h3 className="text-xl font-bold tracking-tight mb-6">Change Password</h3>
                
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Old Password
                    <InputText
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      required
                      placeholder="Enter old password"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    New Password
                    <InputText
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      placeholder="Enter new password"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    Confirm New Password
                    <InputText
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Confirm new password"
                    />
                  </label>
                  <Button type="submit" label="Change password" icon="pi pi-lock" loading={saving} severity="warning" className="mt-4 justify-center font-bold" />
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
