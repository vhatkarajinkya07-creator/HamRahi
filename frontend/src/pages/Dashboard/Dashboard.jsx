// Dashboard.jsx — fully API-driven, no static seed data
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import api from "../../services/api";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  // Diary form state
  const [diaryText, setDiaryText] = useState("");
  const [diaryDate, setDiaryDate] = useState("");
  const [diaryPhoto, setDiaryPhoto] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [diaryLoading, setDiaryLoading] = useState(false);

  // Canvas refs for card export
  const coverCanvasRef = useRef(null);
  const routeCanvasRef = useRef(null);

  // ─── Load Trips ───────────────────────────────────────────────────────────
  const loadTrips = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/trips");
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError("Could not load trips. Please check your connection.");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Derived lists
  const activeTrip = trips.find((t) => t.status === "active");
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");
  const completedTrips = trips.filter((t) => t.status === "completed");

  // ─── Countdown Helper ─────────────────────────────────────────────────────
  const getDaysCountdown = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // ─── Status Change ────────────────────────────────────────────────────────
  const handleUpdateStatus = async (tripId, newStatus) => {
    setError("");
    try {
      const { data } = await api.put(`/trips/${tripId}`, { status: newStatus });
      setTrips((prev) => prev.map((t) => (t._id === tripId ? data : t)));
      // If marking active, switch to active tab
      if (newStatus === "active") setActiveTab("active");
      if (newStatus === "completed") setActiveTab("completed");
    } catch (err) {
      setError(`Failed to update trip status.`);
    }
  };

  // ─── Delete Trip ──────────────────────────────────────────────────────────
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip permanently?")) return;
    setError("");
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
    } catch (err) {
      setError("Failed to delete trip.");
    }
  };

  // ─── Diary CRUD ───────────────────────────────────────────────────────────
  const handleAddDiaryEntry = async (e) => {
    e.preventDefault();
    if (!activeTrip || !diaryText.trim()) return;
    setDiaryLoading(true);
    setError("");

    const currentDiary = activeTrip.diary || [];
    let updatedDiary;

    if (editingEntryId) {
      updatedDiary = currentDiary.map((entry) =>
        (entry._id === editingEntryId || entry.id === editingEntryId)
          ? { ...entry, text: diaryText, date: diaryDate, photo: diaryPhoto || entry.photo }
          : entry
      );
      setEditingEntryId(null);
    } else {
      const newEntry = {
        date: diaryDate || new Date().toISOString().split("T")[0],
        text: diaryText,
        photo: diaryPhoto || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
      };
      updatedDiary = [...currentDiary, newEntry];
    }

    try {
      const { data } = await api.put(`/trips/${activeTrip._id}`, { diary: updatedDiary });
      setTrips((prev) => prev.map((t) => (t._id === activeTrip._id ? data : t)));
      setDiaryText("");
      setDiaryDate("");
      setDiaryPhoto("");
    } catch (err) {
      setError("Failed to save diary entry.");
    } finally {
      setDiaryLoading(false);
    }
  };

  const handleEditDiaryEntry = (entry) => {
    setEditingEntryId(entry._id || entry.id);
    setDiaryText(entry.text);
    setDiaryDate(entry.date);
    setDiaryPhoto(entry.photo || "");
  };

  const handleDeleteDiaryEntry = async (entryId) => {
    if (!activeTrip) return;
    const updatedDiary = (activeTrip.diary || []).filter(
      (entry) => entry._id !== entryId && entry.id !== entryId
    );
    try {
      const { data } = await api.put(`/trips/${activeTrip._id}`, { diary: updatedDiary });
      setTrips((prev) => prev.map((t) => (t._id === activeTrip._id ? data : t)));
    } catch (err) {
      setError("Failed to delete diary entry.");
    }
  };

  const cancelEdit = () => {
    setEditingEntryId(null);
    setDiaryText("");
    setDiaryDate("");
    setDiaryPhoto("");
  };

  // ─── Canvas Card Export ───────────────────────────────────────────────────
  const generateCoverCard = (trip) => {
    const canvas = coverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#161A2E");
    grad.addColorStop(1, "#0D0F1C");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FF8870";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("HAMRAHI PASSPORT", 50, 80);
    ctx.fillStyle = "#F5F0E6";
    ctx.font = "800 48px sans-serif";
    ctx.fillText((trip.destination || trip.name).toUpperCase(), 50, 150);
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`${trip.country || ""}`, 50, 190);
    ctx.fillStyle = "#9CA3C4";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Duration: ${trip.daysCount} Days`, 50, 260);
    ctx.fillText(`Style: ${trip.travelStyle}`, 50, 290);
    ctx.fillText(`Budget: ${trip.budget}`, 50, 320);
    ctx.fillText(`Dates: ${trip.startDate} → ${trip.endDate}`, 50, 350);
    ctx.strokeStyle = "rgba(255, 246, 224, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
    const link = document.createElement("a");
    link.download = `${(trip.destination || trip.name).toLowerCase().replace(/\s+/g, "_")}_cover.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const generateRouteCard = (trip) => {
    const canvas = routeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0D0F1C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00E5C6";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("HAMRAHI ROUTE CARD", 50, 80);
    ctx.fillStyle = "#F5F0E6";
    ctx.font = "800 36px sans-serif";
    ctx.fillText((trip.destination || trip.name).toUpperCase(), 50, 140);
    ctx.strokeStyle = "#00E5C6";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00E5C6";
    ctx.beginPath();
    ctx.moveTo(100, 350);
    ctx.quadraticCurveTo(200, 220, 300, 320);
    ctx.lineTo(450, 250);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FFFFFF";
    [[100, 350], [300, 320], [450, 250]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#9CA3C4";
    ctx.font = "15px sans-serif";
    ctx.fillText(`Journey: ${trip.startDate} → ${trip.endDate}`, 50, 480);
    ctx.fillText(`${trip.daysCount} days · ${trip.travelStyle} · ${trip.budget}`, 50, 510);
    ctx.strokeStyle = "rgba(255,246,224,0.1)";
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
    const link = document.createElement("a");
    link.download = `${(trip.destination || trip.name).toLowerCase().replace(/\s+/g, "_")}_route.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ─── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <i className="pi pi-spin pi-spinner text-4xl text-[var(--theme-primary)]" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">Loading your travel dashboard…</p>
        </div>
      </section>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300">
      <div className="mx-auto max-w-[1180px]">

        {/* Hidden canvases for card export */}
        <canvas ref={coverCanvasRef} width={500} height={600} className="hidden" />
        <canvas ref={routeCanvasRef} width={500} height={600} className="hidden" />

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Travel Dashboard</span>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight">My Trips</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-[var(--bg-surface)] p-1.5 rounded-full border border-[var(--border-subtle)] self-start shadow-sm">
            {[
              { key: "upcoming", label: `Upcoming (${upcomingTrips.length})` },
              { key: "active", label: "Active Trip" },
              { key: "completed", label: `Completed (${completedTrips.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                  activeTab === key
                    ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <Message severity="error" text={error} className="mb-6 w-full" />}

        <div className="min-h-[400px]">

          {/* ── UPCOMING ──────────────────────────────────────────────────── */}
          {activeTab === "upcoming" && (
            <div className="space-y-6">
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-20 rounded-[28px] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-map text-5xl text-[var(--text-secondary)] mb-4 block opacity-30" />
                  <h3 className="text-xl font-bold">No upcoming trips yet</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto">
                    Generate an itinerary from the Itinerary page and save it to your dashboard to see it here.
                  </p>
                </div>
              ) : (
                upcomingTrips.map((trip) => {
                  const countdown = getDaysCountdown(trip.startDate);
                  return (
                    <div
                      key={trip._id}
                      className="grid gap-6 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:grid-cols-[280px_1fr] md:p-8 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={trip.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
                        alt={trip.destination || trip.name}
                        className="h-44 w-full rounded-[var(--radius-md)] object-cover shadow-sm"
                      />
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-coral)]">Upcoming</span>
                              <h2 className="text-3xl font-extrabold tracking-tight mt-1">{trip.name}</h2>
                              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{trip.destination}{trip.country ? `, ${trip.country}` : ""}</p>
                            </div>
                            <div className="rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] px-5 py-3 text-center shadow-sm min-w-[70px]">
                              <span className="block text-2xl font-black text-[var(--color-coral)]">{countdown}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Days Left</span>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-4 leading-6 max-w-[620px]">{trip.itinerarySummary}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t border-[var(--border-subtle)] pt-4">
                          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
                            <span>Starts: {trip.startDate}</span>
                            <span>Ends: {trip.endDate}</span>
                            <span>Budget: {trip.budget}</span>
                            <span>Style: {trip.travelStyle}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              label="Start Journey"
                              icon="pi pi-play"
                              className="text-xs px-3 py-1.5 rounded-xl font-bold bg-[var(--theme-primary)] border-none text-white hover:opacity-90"
                              onClick={() => handleUpdateStatus(trip._id, "active")}
                            />
                            <Button
                              label="Delete"
                              icon="pi pi-trash"
                              className="text-xs px-3 py-1.5 rounded-xl font-bold border-red-200 text-red-500 hover:bg-red-500/10"
                              outlined
                              onClick={() => handleDeleteTrip(trip._id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── ACTIVE ────────────────────────────────────────────────────── */}
          {activeTab === "active" && (
            <div className="space-y-8">
              {!activeTrip ? (
                <div className="text-center py-20 rounded-[28px] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-compass text-5xl text-[var(--text-secondary)] mb-4 block opacity-30" />
                  <h3 className="text-xl font-bold">No active trip</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    Start an upcoming trip to unlock your live Travel Diary.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                  {/* Diary Editor + Timeline */}
                  <div className="space-y-6">
                    <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">Active Trip</span>
                          <h2 className="text-2xl font-extrabold tracking-tight mt-1">{activeTrip.destination || activeTrip.name}</h2>
                        </div>
                        <Button
                          label="Finish Journey"
                          icon="pi pi-check"
                          className="text-xs px-4 py-2 rounded-xl font-bold bg-emerald-600 border-none text-white hover:bg-emerald-500"
                          onClick={() => handleUpdateStatus(activeTrip._id, "completed")}
                        />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-6 mb-6">
                        Log your memories live — food, sights, feelings. They'll be locked into your Memory Vault once the journey is complete.
                      </p>

                      <form onSubmit={handleAddDiaryEntry} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Entry Date
                            <InputText
                              type="date"
                              value={diaryDate}
                              onChange={(e) => setDiaryDate(e.target.value)}
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Photo URL (optional)
                            <InputText
                              type="url"
                              value={diaryPhoto}
                              onChange={(e) => setDiaryPhoto(e.target.value)}
                              placeholder="https://..."
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          What happened?
                          <InputTextarea
                            value={diaryText}
                            onChange={(e) => setDiaryText(e.target.value)}
                            required
                            rows={4}
                            placeholder="Describe the moment — the smell, the light, the feeling…"
                          />
                        </label>
                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            label={diaryLoading ? "Saving…" : editingEntryId ? "Save Edit" : "Add Log Entry"}
                            icon={editingEntryId ? "pi pi-check" : "pi pi-pencil"}
                            disabled={diaryLoading || !diaryText.trim()}
                            className="font-bold"
                          />
                          {editingEntryId && (
                            <Button
                              type="button"
                              label="Cancel"
                              icon="pi pi-times"
                              outlined
                              onClick={cancelEdit}
                              className="font-bold"
                            />
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Diary Timeline */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold tracking-tight px-1">Trip Diary</h3>
                      {(!activeTrip.diary || activeTrip.diary.length === 0) ? (
                        <div className="text-center py-10 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                          <i className="pi pi-book text-3xl text-[var(--text-secondary)] mb-3 block opacity-30" />
                          <p className="text-sm text-[var(--text-secondary)]">No entries yet. Write your first memory above!</p>
                        </div>
                      ) : (
                        [...activeTrip.diary].reverse().map((entry) => {
                          const entryId = entry._id || entry.id;
                          return (
                            <div key={entryId} className="grid gap-5 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] md:grid-cols-[180px_1fr]">
                              {entry.photo && (
                                <img src={entry.photo} alt="Diary" className="h-28 w-full rounded-xl object-cover shadow-sm" />
                              )}
                              <div className="flex flex-col justify-between">
                                <div>
                                  <span className="font-mono text-xs text-[var(--text-secondary)]">{entry.date}</span>
                                  <p className="text-sm text-[var(--text-primary)] leading-6 mt-2">{entry.text}</p>
                                </div>
                                <div className="flex gap-4 mt-3 justify-end text-xs font-bold">
                                  <button type="button" onClick={() => handleEditDiaryEntry(entry)} className="text-[var(--color-violet)] hover:underline">
                                    Edit
                                  </button>
                                  <button type="button" onClick={() => handleDeleteDiaryEntry(entryId)} className="text-red-400 hover:underline">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Active Trip Sidebar */}
                  <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm self-start space-y-4">
                    <img
                      src={activeTrip.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
                      alt={activeTrip.destination}
                      className="h-40 w-full rounded-[var(--radius-md)] object-cover shadow-sm"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{activeTrip.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{activeTrip.destination}{activeTrip.country ? `, ${activeTrip.country}` : ""}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{activeTrip.startDate} → {activeTrip.endDate}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      <div className="rounded-xl bg-[var(--bg-surface-raised)] p-3 border border-[var(--border-subtle)]">
                        <span className="block text-lg font-black text-[var(--theme-primary)]">{activeTrip.daysCount}</span>
                        <span className="text-[var(--text-secondary)]">Days</span>
                      </div>
                      <div className="rounded-xl bg-[var(--bg-surface-raised)] p-3 border border-[var(--border-subtle)]">
                        <span className="block text-lg font-black text-[var(--theme-primary)]">{(activeTrip.diary || []).length}</span>
                        <span className="text-[var(--text-secondary)]">Logs</span>
                      </div>
                      <div className="rounded-xl bg-[var(--bg-surface-raised)] p-3 border border-[var(--border-subtle)]">
                        <span className="block text-sm font-black text-[var(--theme-primary)]">{activeTrip.budget}</span>
                        <span className="text-[var(--text-secondary)]">Budget</span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-6">{activeTrip.itinerarySummary}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── COMPLETED ─────────────────────────────────────────────────── */}
          {activeTab === "completed" && (
            <div className="space-y-6">
              {completedTrips.length === 0 ? (
                <div className="text-center py-20 rounded-[28px] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-star text-5xl text-[var(--text-secondary)] mb-4 block opacity-30" />
                  <h3 className="text-xl font-bold">No completed trips yet</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    Finish an active trip to lock it into your Memory Vault.
                  </p>
                </div>
              ) : (
                completedTrips.map((trip) => (
                  <div key={trip._id} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[var(--border-subtle)] pb-6 mb-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">Memory Vault</span>
                        <h2 className="text-3xl font-extrabold tracking-tight mt-1">{trip.name}</h2>
                        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                          {trip.destination}{trip.country ? `, ${trip.country}` : ""} · {trip.startDate} → {trip.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          label="Cover Card"
                          icon="pi pi-image"
                          outlined
                          className="p-button-outlined text-xs border-[var(--border-subtle)] text-[var(--text-primary)]"
                          onClick={() => generateCoverCard(trip)}
                        />
                        <Button
                          label="Route Card"
                          icon="pi pi-map"
                          outlined
                          className="p-button-outlined text-xs border-[var(--border-subtle)] text-[var(--text-primary)]"
                          onClick={() => generateRouteCard(trip)}
                        />
                        <Button
                          label="Delete"
                          icon="pi pi-trash"
                          outlined
                          className="p-button-outlined text-xs border-red-200 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteTrip(trip._id)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                      {/* Memory logs */}
                      <div>
                        <h3 className="text-lg font-bold tracking-tight mb-4">Journey Memories</h3>
                        {(!trip.diary || trip.diary.length === 0) ? (
                          <p className="text-sm text-[var(--text-secondary)]">No diary entries were recorded during this trip.</p>
                        ) : (
                          <div className="space-y-4">
                            {trip.diary.map((entry) => (
                              <div key={entry._id || entry.id} className="flex gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/30">
                                {entry.photo && (
                                  <img src={entry.photo} alt="Memory" className="h-16 w-16 rounded-lg object-cover shrink-0 shadow-sm" />
                                )}
                                <div>
                                  <span className="font-mono text-[10px] text-[var(--text-secondary)]">{entry.date}</span>
                                  <p className="text-sm text-[var(--text-primary)] mt-1 leading-6">{entry.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/20 p-5 self-start space-y-3">
                        <h4 className="font-bold text-sm tracking-tight border-b border-[var(--border-subtle)] pb-2">Trip Summary</h4>
                        {[
                          ["Total Days", trip.daysCount],
                          ["Style", trip.travelStyle],
                          ["Budget", trip.budget],
                          ["Diary Entries", (trip.diary || []).length],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">{label}</span>
                            <span className="font-bold">{val}</span>
                          </div>
                        ))}
                        <p className="text-[11px] leading-5 text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
                          <i className="pi pi-info-circle mr-1" />
                          Visit your Profile to view passport badges earned from this trip.
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
