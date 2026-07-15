// Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import api from "../../services/api";

const INITIAL_TRIPS = [
  {
    id: "trip-bali",
    placeId: "bali",
    name: "Bali Spiritual Escape",
    destination: "Bali",
    country: "Indonesia",
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    startDate: "2026-09-10",
    endDate: "2026-09-17",
    days: 7,
    budget: "Medium",
    travelStyle: "Friends",
    itinerarySummary: "A week under tropical temples and beach waves with friends."
  },
  {
    id: "trip-tokyo",
    placeId: "tokyo",
    name: "Neon Lights & Sushi Trails",
    destination: "Tokyo",
    country: "Japan",
    heroImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
    status: "active",
    startDate: "2026-07-14",
    endDate: "2026-07-21",
    days: 7,
    budget: "High",
    travelStyle: "Solo",
    itinerarySummary: "Exploring Tokyo's historic temples and modern skyscrapers.",
    diary: [
      { id: "e1", date: "2026-07-14", text: "Visited Senso-ji temple in Asakusa today. The morning air was spiritual, and Nakamise street had delicious snacks!", photo: "https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=600&q=80" },
      { id: "e2", date: "2026-07-15", text: "Strolled around Shibuya crossing and had ramen in Ichiran. The crowds are surreal!", photo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: "trip-swiss",
    placeId: "swiss-alps",
    name: "Alpine Clarity Peak Trail",
    destination: "Swiss Alps",
    country: "Switzerland",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    startDate: "2026-06-10",
    endDate: "2026-06-15",
    days: 5,
    budget: "High",
    travelStyle: "Couple",
    itinerarySummary: "Mountain peaks, glacier trains, and cozy chalet evenings.",
    diary: [
      { id: "e3", date: "2026-06-11", text: "Took the train up to Jungfraujoch. Standing at the Top of Europe was breathtaking!", photo: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=600&q=80" },
      { id: "e4", date: "2026-06-13", text: "Walked around Lake Geneva. The water is glassy and the air is crisp.", photo: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80" }
    ]
  }
];

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming | active | completed
  
  // Diary Add Entry Form State
  const [diaryText, setDiaryText] = useState("");
  const [diaryDate, setDiaryDate] = useState("");
  const [diaryPhoto, setDiaryPhoto] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);

  // Canvas Refs
  const coverCanvasRef = useRef(null);
  const routeCanvasRef = useRef(null);
  
  const loadTrips = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/trips");
      // If user has no trips in DB, seed with initial mock trips for a beautiful initial experience
      if (Array.isArray(data) && data.length === 0) {
        // Save initial trips to DB so they become real entries for this user
        const seededTrips = [];
        for (const trip of INITIAL_TRIPS) {
          try {
            const { data: seeded } = await api.post("/trips", {
              placeId: trip.placeId,
              name: trip.name,
              startDate: trip.startDate,
              endDate: trip.endDate,
              daysCount: trip.days,
              budget: trip.budget,
              travelStyle: trip.travelStyle,
              itinerarySummary: trip.itinerarySummary,
              days: []
            });
            // Update seeded trip with initial diary entries if they exist
            if (trip.diary && trip.diary.length > 0) {
              const { data: updated } = await api.put(`/trips/${seeded._id}`, { diary: trip.diary });
              seededTrips.push(updated);
            } else {
              seededTrips.push(seeded);
            }
          } catch (err) {
            console.error("Failed to seed initial trip:", err);
          }
        }
        setTrips(seededTrips.length ? seededTrips : INITIAL_TRIPS);
      } else {
        setTrips(data);
      }
    } catch (err) {
      console.error("Failed to load trips:", err);
      setError("Failed to load trips from database.");
      setTrips(INITIAL_TRIPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const activeTrip = trips.find((t) => t.status === "active");
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");
  const completedTrips = trips.filter((t) => t.status === "completed");

  // Countdown Helper
  const getDaysCountdown = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Active Trip Diary CRUD
  const handleAddDiaryEntry = async (e) => {
    e.preventDefault();
    if (!activeTrip) return;

    let updatedDiary;
    if (editingEntryId) {
      // Edit
      updatedDiary = activeTrip.diary.map((entry) =>
        (entry.id === editingEntryId || entry._id === editingEntryId)
          ? { ...entry, text: diaryText, date: diaryDate, photo: diaryPhoto || entry.photo }
          : entry
      );
      setEditingEntryId(null);
    } else {
      // Create
      const newEntry = {
        date: diaryDate || new Date().toISOString().split("T")[0],
        text: diaryText,
        photo: diaryPhoto || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80`
      };
      updatedDiary = [...(activeTrip.diary || []), newEntry];
    }

    try {
      const { data } = await api.put(`/trips/${activeTrip._id}`, { diary: updatedDiary });
      setTrips((prevTrips) =>
        prevTrips.map((t) => (t._id === activeTrip._id ? data : t))
      );
      setDiaryText("");
      setDiaryDate("");
      setDiaryPhoto("");
    } catch (err) {
      setError("Failed to update diary in database.");
    }
  };

  const handleEditDiaryEntry = (entry) => {
    setEditingEntryId(entry._id || entry.id);
    setDiaryText(entry.text);
    setDiaryDate(entry.date);
    setDiaryPhoto(entry.photo);
  };

  const handleDeleteDiaryEntry = async (id) => {
    if (!activeTrip) return;
    const updatedDiary = activeTrip.diary.filter((entry) => entry.id !== id && entry._id !== id);
    try {
      const { data } = await api.put(`/trips/${activeTrip._id}`, { diary: updatedDiary });
      setTrips((prevTrips) =>
        prevTrips.map((t) => (t._id === activeTrip._id ? data : t))
      );
    } catch (err) {
      setError("Failed to delete diary entry from database.");
    }
  };

  const handleUpdateStatus = async (tripId, newStatus) => {
    setError("");
    try {
      const { data } = await api.put(`/trips/${tripId}`, { status: newStatus });
      setTrips((prevTrips) =>
        prevTrips.map((t) => (t._id === tripId ? data : t))
      );
    } catch (err) {
      setError(`Failed to update status to ${newStatus}.`);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    setError("");
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prevTrips) => prevTrips.filter((t) => t._id !== tripId && t.id !== tripId));
    } catch (err) {
      setError("Failed to delete trip from database.");
    }
  };

  // Export Cards to Image
  const generateCoverCard = (trip) => {
    const canvas = coverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Draw Dark Gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#161A2E");
    grad.addColorStop(1, "#0D0F1C");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cover Card text
    ctx.fillStyle = "#FF8870"; // Coral Accent
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("HAMRAHI PASSPORT", 50, 80);

    ctx.fillStyle = "#F5F0E6"; // Text Primary
    ctx.font = "800 48px sans-serif";
    ctx.fillText(trip.destination.toUpperCase(), 50, 150);

    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`${trip.country}`, 50, 190);

    ctx.fillStyle = "#9CA3C4"; // Text Secondary
    ctx.font = "16px sans-serif";
    ctx.fillText(`Duration: ${trip.days} Days`, 50, 260);
    ctx.fillText(`Style: ${trip.travelStyle}`, 50, 290);
    ctx.fillText(`Budget: ${trip.budget}`, 50, 320);
    ctx.fillText(`Dates: ${trip.startDate} to ${trip.endDate}`, 50, 350);

    // Save overlay design
    ctx.strokeStyle = "rgba(255, 246, 224, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    // Trigger download
    const link = document.createElement("a");
    link.download = `${trip.destination.toLowerCase()}_cover_card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const generateRouteCard = (trip) => {
    const canvas = routeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Draw Dark background
    ctx.fillStyle = "#0D0F1C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00E5C6"; // Teal Accent
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("STRAVA STYLE ROUTE", 50, 80);

    ctx.fillStyle = "#F5F0E6";
    ctx.font = "800 36px sans-serif";
    ctx.fillText(trip.destination.toUpperCase(), 50, 140);

    // Drawing a glowing map pathway
    ctx.strokeStyle = "#00E5C6";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00E5C6";
    ctx.beginPath();
    ctx.moveTo(100, 350);
    ctx.quadraticCurveTo(200, 220, 300, 320);
    ctx.lineTo(450, 250);
    ctx.stroke();

    // Nodes
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath(); ctx.arc(100, 350, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(300, 320, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(450, 250, 8, 0, Math.PI * 2); ctx.fill();

    // Stats
    ctx.fillStyle = "#9CA3C4";
    ctx.font = "15px sans-serif";
    ctx.fillText("Estimated Distance: 284 km", 50, 480);
    ctx.fillText("Elevation Change: +1,240 m", 50, 510);
    ctx.fillText(`Journey Completed: ${trip.endDate}`, 50, 540);

    // Border
    ctx.strokeStyle = "rgba(255, 246, 224, 0.1)";
    ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

    // Trigger download
    const link = document.createElement("a");
    link.download = `${trip.destination.toLowerCase()}_route_card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="pi pi-spin pi-spinner text-4xl text-[var(--theme-primary)] animate-spin" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">Loading your travel dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300">
      <div className="mx-auto max-w-[1180px]">
        
        {/* Hidden canvases for card export */}
        <canvas ref={coverCanvasRef} width={500} height={600} className="hidden" />
        <canvas ref={routeCanvasRef} width={500} height={600} className="hidden" />

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Travel Dashboard</span>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight">My Trips</h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-[var(--bg-surface)] p-1.5 rounded-full border border-[var(--border-subtle)] self-start shadow-sm">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                activeTab === "upcoming" ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Upcoming ({upcomingTrips.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                activeTab === "active" ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Active Trip
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                activeTab === "completed" ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Completed ({completedTrips.length})
            </button>
          </div>
        </div>

        {error && <Message severity="error" text={error} className="mb-6 w-full" />}

        {/* Tab content screens */}
        <div className="min-h-[400px]">
          
          {/* Upcoming Screen */}
          {activeTab === "upcoming" && (
            <div className="space-y-6">
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-16 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-calendar-plus text-4xl text-[var(--text-secondary)] mb-4 block opacity-50" />
                  <h3 className="text-xl font-bold">No upcoming trips</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">Plan a new destination to see your schedule timeline here.</p>
                </div>
              ) : (
                upcomingTrips.map((trip) => {
                  const countdown = getDaysCountdown(trip.startDate);
                  const tripId = trip._id || trip.id;
                  return (
                    <div
                      key={tripId}
                      className="grid gap-6 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:grid-cols-[280px_1fr] md:p-8 hover:shadow-md transition-shadow"
                    >
                      <img src={trip.heroImage} alt={trip.destination} className="h-44 w-full rounded-[var(--radius-md)] object-cover shadow-sm" />
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-coral)]">
                                Countdown
                              </span>
                              <h2 className="text-3xl font-extrabold tracking-tight mt-1">{trip.name}</h2>
                            </div>
                            <div className="rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] px-5 py-3 text-center shadow-sm">
                              <span className="block text-2xl font-black text-[var(--color-coral)]">{countdown}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Days Left</span>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-4 leading-6 max-w-[620px]">{trip.itinerarySummary}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t border-[var(--border-subtle)] pt-4">
                          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
                            <span>Starts: {trip.startDate}</span>
                            <span>Budget: {trip.budget}</span>
                            <span>Style: {trip.travelStyle}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              label="Start Journey"
                              icon="pi pi-play"
                              className="text-xs px-3 py-1.5 rounded-xl font-bold bg-[var(--theme-primary)] border-none text-white hover:bg-[var(--theme-primary)]/90"
                              onClick={() => handleUpdateStatus(tripId, "active")}
                            />
                            <Button
                              label="Delete"
                              icon="pi pi-trash"
                              className="text-xs px-3 py-1.5 rounded-xl font-bold border-red-200 text-red-500 hover:bg-red-500/10"
                              outlined
                              onClick={() => handleDeleteTrip(tripId)}
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

          {/* Active Screen */}
          {activeTab === "active" && (
            <div className="space-y-8">
              {!activeTrip ? (
                <div className="text-center py-16 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-play text-4xl text-[var(--text-secondary)] mb-4 block opacity-50" />
                  <h3 className="text-xl font-bold">No active trip currently</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">When you depart on an upcoming trip, your active Travel Diary will unlock here.</p>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
                  
                  {/* Diary log editor */}
                  <div className="space-y-6">
                    <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h2 className="text-2xl font-extrabold tracking-tight">Active Trip: {activeTrip.destination}</h2>
                        <Button
                          label="Finish Journey"
                          icon="pi pi-check"
                          className="text-xs px-4 py-2 rounded-xl font-bold bg-emerald-600 border-none text-white hover:bg-emerald-500"
                          onClick={() => handleUpdateStatus(activeTrip._id || activeTrip.id, "completed")}
                        />
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-6 mb-6">
                        Write down your memories, locations, food tastes, and logs live. Your records will compile into your permanent Memory Vault once completed.
                      </p>

                      <form onSubmit={handleAddDiaryEntry} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Entry Date
                            <InputText
                              type="date"
                              value={diaryDate}
                              onChange={(e) => setDiaryDate(e.target.value)}
                              required
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            Image Link (Optional)
                            <InputText
                              type="url"
                              value={diaryPhoto}
                              onChange={(e) => setDiaryPhoto(e.target.value)}
                              placeholder="https://example.com/photo.jpg"
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          What did you do?
                          <InputTextarea
                            value={diaryText}
                            onChange={(e) => setDiaryText(e.target.value)}
                            required
                            rows={4}
                            placeholder="Describe your moments, the colors, the atmosphere..."
                          />
                        </label>
                        <Button type="submit" label={editingEntryId ? "Save Edit" : "Add Log Entry"} icon="pi pi-pencil" className="font-bold" />
                      </form>
                    </div>

                    {/* Timeline of current active logs */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold tracking-tight px-2">Trip Diary Timeline</h3>
                      {(!activeTrip.diary || activeTrip.diary.length === 0) ? (
                        <p className="text-sm text-[var(--text-secondary)] px-2">No diary entries logged yet. Write your first memory above!</p>
                      ) : (
                        activeTrip.diary.map((entry) => {
                          const entryId = entry._id || entry.id;
                          return (
                            <div key={entryId} className="grid gap-5 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] md:grid-cols-[180px_1fr]">
                              <img src={entry.photo} alt="Diary spot" className="h-28 w-full rounded-xl object-cover shadow-sm" />
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

                  {/* Active Sidecard */}
                  <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm self-start flex flex-col justify-center">
                    <img src={activeTrip.heroImage} alt={activeTrip.destination} className="h-40 w-full rounded-[var(--radius-md)] object-cover mb-4 shadow-sm" />
                    <h3 className="text-xl font-bold">{activeTrip.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5">{activeTrip.startDate} to {activeTrip.endDate}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-4 leading-6">{activeTrip.itinerarySummary}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed Screen */}
          {activeTab === "completed" && (
            <div className="space-y-6">
              {completedTrips.length === 0 ? (
                <div className="text-center py-16 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8">
                  <i className="pi pi-check-circle text-4xl text-[var(--text-secondary)] mb-4 block opacity-50" />
                  <h3 className="text-xl font-bold">No completed trips</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">Finish your active trips to lock them in your Memory Vault.</p>
                </div>
              ) : (
                completedTrips.map((trip) => {
                  const tripId = trip._id || trip.id;
                  return (
                    <div key={tripId} className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm md:p-8">
                      
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[var(--border-subtle)] pb-6 mb-6">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">
                            Completed Trip
                          </span>
                          <h2 className="text-3xl font-extrabold tracking-tight mt-1">{trip.name}</h2>
                          <p className="text-xs text-[var(--text-secondary)] mt-1.5">{trip.startDate} to {trip.endDate}</p>
                        </div>
                        
                        {/* Card exporters */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            label="Cover Card"
                            icon="pi pi-image"
                            className="p-button-outlined text-xs border-[var(--border-subtle)] text-[var(--text-primary)]"
                            onClick={() => generateCoverCard(trip)}
                          />
                          <Button
                            label="Route Card"
                            icon="pi pi-map"
                            className="p-button-outlined text-xs border-[var(--border-subtle)] text-[var(--text-primary)]"
                            onClick={() => generateRouteCard(trip)}
                          />
                          <Button
                            label="Delete Record"
                            icon="pi pi-trash"
                            className="p-button-outlined text-xs border-red-200 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteTrip(tripId)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
                        {/* Vault diary log summary */}
                        <div>
                          <h3 className="text-lg font-bold tracking-tight mb-4">Memory Vault Records</h3>
                          {(!trip.diary || trip.diary.length === 0) ? (
                            <p className="text-sm text-[var(--text-secondary)]">No logs were recorded during this trip.</p>
                          ) : (
                            <div className="space-y-4">
                              {trip.diary.map((entry) => {
                                const entryId = entry._id || entry.id;
                                return (
                                  <div key={entryId} className="flex gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/30">
                                    <img src={entry.photo} alt="Vault spot" className="h-16 w-16 rounded-lg object-cover shrink-0 shadow-sm" />
                                    <div>
                                      <span className="font-mono text-[10px] text-[var(--text-secondary)]">{entry.date}</span>
                                      <p className="text-sm text-[var(--text-primary)] mt-1 leading-6">{entry.text}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Completed summary details */}
                        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/20 p-5 self-start space-y-4">
                          <h4 className="font-bold text-sm tracking-tight border-b border-[var(--border-subtle)] pb-2">Trip Summary</h4>
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">Total Days</span>
                            <span className="font-bold">{trip.daysCount || trip.days}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">Style</span>
                            <span className="font-bold">{trip.travelStyle}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-secondary)]">Budget</span>
                            <span className="font-bold">{trip.budget}</span>
                          </div>
                          
                          <div className="text-[11px] leading-5 text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
                            <i className="pi pi-info-circle mr-1" />
                            Earned achievements evaluated. Visit your profile to view unlocked passport badges.
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
