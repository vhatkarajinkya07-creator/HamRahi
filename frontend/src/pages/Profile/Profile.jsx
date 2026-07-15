// Profile.jsx
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const MOCK_BADGES = [
  { id: "beach-bum", name: "Beach Bum", description: "Saved or visited 3 beach destinations", icon: "pi-sun", color: "text-amber-400 border-amber-400/20 bg-amber-400/5", unlocked: true },
  { id: "alpine-king", name: "Alpine King", description: "Saved or visited 3 mountain destinations", icon: "pi-compass", color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5", unlocked: false },
  { id: "urban-legend", name: "Urban Legend", description: "Saved or visited 3 urban cities", icon: "pi-building", color: "text-violet-400 border-violet-400/20 bg-violet-400/5", unlocked: true },
  { id: "globetrotter", name: "Globetrotter", description: "Generate 5 AI itineraries", icon: "pi-globe", color: "text-sky-400 border-sky-400/20 bg-sky-400/5", unlocked: false },
  { id: "travel-writer", name: "Travel Writer", description: "Write 3 travel diary logs", icon: "pi-pencil", color: "text-coral-400 border-coral-400/20 bg-coral-400/5", unlocked: true },
  { id: "first-stamp", name: "First Stamp", description: "Complete your first trip", icon: "pi-verified", color: "text-teal-400 border-teal-400/20 bg-teal-400/5", unlocked: false },
];

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("dna"); // dna | settings | badges
  const [wishlist, setWishlist] = useState([]);
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
    async function fetchDNAData() {
      try {
        const { data } = await api.get("/wishlist");
        setWishlist(data);

        // Count occurrences of tags
        const counts = {};
        let total = 0;
        data.forEach((item) => {
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
        console.error("Could not compute Travel DNA:", err);
      }
    }
    fetchDNAData();
  }, []);

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
                {MOCK_BADGES.map((badge) => (
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
