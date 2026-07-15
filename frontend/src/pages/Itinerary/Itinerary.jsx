// Itinerary.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";

const budgetOptions = ["Low", "Medium", "High"].map((value) => ({ label: value, value }));
const styleOptions = ["Solo", "Couple", "Family", "Friends"].map((value) => ({ label: value, value }));

export default function Itinerary() {
  const location = useLocation();
  const prefilledPlaceId = location.state?.placeId;
  const prefilledDestinationName = location.state?.destinationName;

  const [form, setForm] = useState({
    placeId: prefilledPlaceId || "",
    days: 5,
    budget: "Medium",
    travelStyle: "Friends",
    interests: ["Food", "Culture"],
  });
  
  const [interestInput, setInterestInput] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefilledPlaceId) {
      setForm((prev) => ({ ...prev, placeId: prefilledPlaceId }));
    }
  }, [prefilledPlaceId]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleAddInterest = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = interestInput.trim().replace(/,$/, "");
      if (val && !form.interests.includes(val)) {
        updateField("interests", [...form.interests, val]);
      }
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (tag) => {
    updateField("interests", form.interests.filter((t) => t !== tag));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setItinerary(null);

    try {
      const { data } = await api.post("/itinerary/generate", form);
      setItinerary(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  // If no placeId is provided, guide the user to choose one from exploration first
  if (!prefilledPlaceId) {
    return (
      <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] flex items-center justify-center">
        <div className="max-w-[500px] text-center rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-xl">
          <i className="pi pi-sparkles text-5xl text-[var(--theme-primary)] mb-6 block animate-pulse" />
          <h2 className="text-3xl font-extrabold tracking-tight">Select a Destination First</h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)] leading-6">
            AI itineraries are custom-generated for specific destinations. Please select a destination from the Explore board to begin planning.
          </p>
          <Link
            to="/#destinations"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-6 py-3.5 text-sm font-extrabold text-white transition-all active:scale-95 hover:bg-[var(--theme-primary)]/90 shadow-md shadow-[var(--theme-primary)]/15"
          >
            <i className="pi pi-compass text-sm" />
            Explore Destinations
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[400px_1fr]">
        
        {/* Planning Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm self-start no-print md:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">AI trip planner</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Build itinerary</h1>

          <div className="mt-7 flex flex-col gap-6">
            {/* Destination Panel */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Destination</span>
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-4 py-3.5 shadow-sm">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                  <i className="pi pi-map-marker text-lg" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-base font-bold text-[var(--text-primary)] truncate">
                    {prefilledDestinationName || "Selected Place"}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-wider">
                    ID: {form.placeId}
                  </span>
                </div>
              </div>
            </div>

            {/* Days Input */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Days</span>
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => updateField("days", Math.max(1, form.days - 1))}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] transition-all active:scale-95 hover:bg-[var(--border-subtle)]/30"
                >
                  <i className="pi pi-minus text-xs" />
                </button>
                <span className="text-lg font-bold text-[var(--text-primary)]">{form.days} days</span>
                <button
                  type="button"
                  onClick={() => updateField("days", Math.min(30, form.days + 1))}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] transition-all active:scale-95 hover:bg-[var(--border-subtle)]/30"
                >
                  <i className="pi pi-plus text-xs" />
                </button>
              </div>
            </div>

            {/* Budget Input */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Budget</span>
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1.5 shadow-sm">
                {budgetOptions.map((opt) => {
                  const active = form.budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("budget", opt.value)}
                      className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
                        active
                          ? "bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/10"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Style Input */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Travel Style</span>
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-1.5 shadow-sm">
                {styleOptions.map((opt) => {
                  const active = form.travelStyle === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("travelStyle", opt.value)}
                      className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
                        active
                          ? "bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/10"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests Input */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Interests</span>
              <div className="flex flex-col gap-2">
                {form.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.interests.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 px-3 py-1 text-xs font-semibold text-[var(--theme-primary)]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(tag)}
                          className="hover:text-red-500 font-bold ml-0.5 inline-flex items-center justify-center w-3 h-3 rounded-full"
                          aria-label={`Remove interest ${tag}`}
                        >
                          <i className="pi pi-times text-[8px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="Type interest and press Enter..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-[var(--theme-primary)] focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200/50 bg-red-50/50 p-4 text-xs font-semibold text-red-600 dark:border-red-950/30 dark:bg-red-950/20 dark:text-red-400">
              <i className="pi pi-exclamation-circle mt-0.5 text-sm shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--theme-primary)] py-4 text-sm font-extrabold text-white transition-all active:scale-95 hover:bg-[var(--theme-primary)]/90 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-[var(--theme-primary)]/15"
          >
            {loading ? (
              <i className="pi pi-spin pi-spinner text-lg animate-spin" />
            ) : (
              <i className="pi pi-sparkles text-sm" />
            )}
            Generate Itinerary
          </button>
        </form>

        {/* Timeline Panel */}
        <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm print-full md:p-8">
          {!itinerary ? (
            <div className="grid min-h-[520px] place-items-center text-center text-[var(--text-secondary)]">
              <div>
                <i className="pi pi-map-marker text-4xl mb-4 block opacity-50 text-[var(--theme-primary)] animate-bounce" />
                <p className="text-sm font-medium">Your generated itinerary will appear here.</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-subtle)] pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {itinerary.destination}
                  </span>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{itinerary.tripSummary}</h2>
                </div>
                <button
                  onClick={() => window.print()}
                  className="no-print flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--border-subtle)]/30 active:scale-95 shadow-sm"
                >
                  <i className="pi pi-file-pdf text-sm text-red-500" />
                  Export PDF
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 no-print">
                <Info label="Estimated Budget" value={itinerary.estimatedBudget} />
                <Info label="Best Time to Visit" value={itinerary.bestTimeToVisit} />
              </div>

              {itinerary.packingEssentials?.length > 0 && (
                <div className="mt-6 no-print rounded-2xl bg-[var(--bg-surface-raised)]/60 p-5 border border-[var(--border-subtle)] shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                    <i className="pi pi-briefcase text-sm text-[var(--theme-primary)]" />
                    Packing Essentials
                  </span>
                  <ul className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-sm text-[var(--text-primary)]">
                    {itinerary.packingEssentials.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 font-medium">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                          <i className="pi pi-check text-[10px]" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Styled Vertical Timeline */}
              <div className="mt-8 relative border-l-2 border-[var(--border-subtle)] pl-6 ml-3 space-y-8">
                {itinerary.days?.map((day) => (
                  <article key={day.day} className="relative group">
                    {/* Timeline Day Circle Indicator */}
                    <div className="absolute -left-[38px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white text-xs font-extrabold shadow-md shadow-[var(--theme-primary)]/20 ring-4 ring-[var(--bg-surface)]">
                      {day.day}
                    </div>
                    
                    <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/45 p-6 shadow-sm transition-all hover:bg-[var(--bg-surface-raised)]/70 hover:shadow-md">
                      <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                        {day.title}
                      </h3>
                      
                      <div className="mt-5 space-y-4">
                        {day.activities?.map((activity, index) => (
                          <div key={`${day.day}-${index}`} className="group/item relative rounded-2xl bg-[var(--bg-surface)]/60 border border-[var(--border-subtle)]/40 p-5 transition-all hover:border-[var(--theme-primary)]/20 hover:bg-[var(--bg-surface)]">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-2 py-0.5 rounded-md">
                                {activity.time}
                              </span>
                            </div>
                            <h4 className="mt-2.5 text-base font-extrabold text-[var(--text-primary)]">
                              {activity.activity}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                              {activity.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/50 p-4">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
      <p className="mt-1 text-[15px] font-semibold text-[var(--text-primary)]">{value || "Not available"}</p>
    </div>
  );
}
