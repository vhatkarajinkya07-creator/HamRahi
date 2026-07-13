import { useState } from "react";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import api from "../../services/api";

const budgetOptions = ["Low", "Medium", "High"].map((value) => ({ label: value, value }));
const styleOptions = ["Solo", "Couple", "Family", "Friends"].map((value) => ({ label: value, value }));

export default function Itinerary() {
  const [form, setForm] = useState({
    placeId: "",
    days: 5,
    budget: "Medium",
    travelStyle: "Friends",
    interests: ["Food", "Culture"],
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
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

  return (
    <section className="min-h-screen bg-[#050505] px-5 pb-20 pt-[120px] text-white">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/14 bg-white/[0.08] p-6 backdrop-blur-3xl md:p-8">
          <span className="text-xs font-semibold uppercase text-white/48">AI trip planner</span>
          <h1 className="mt-3 text-4xl">Build itinerary</h1>

          <div className="mt-7 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              Place ID
              <InputText value={form.placeId} onChange={(event) => updateField("placeId", event.target.value)} required placeholder="Example: R1543125" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              Days
              <InputNumber value={form.days} onValueChange={(event) => updateField("days", event.value || 1)} min={1} max={30} showButtons />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              Budget
              <Dropdown value={form.budget} options={budgetOptions} onChange={(event) => updateField("budget", event.value)} />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              Travel style
              <Dropdown value={form.travelStyle} options={styleOptions} onChange={(event) => updateField("travelStyle", event.value)} />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
              Interests
              <Chips value={form.interests} onChange={(event) => updateField("interests", event.value)} separator="," />
            </label>
          </div>

          {error && <Message severity="error" text={error} className="mt-5 w-full" />}

          <Button type="submit" label="Generate" icon="pi pi-sparkles" loading={loading} className="mt-7 w-full justify-center" />
        </form>

        <div className="rounded-[28px] border border-white/14 bg-white/[0.08] p-6 backdrop-blur-3xl md:p-8">
          {!itinerary ? (
            <div className="grid min-h-[520px] place-items-center text-center text-white/50">
              <p>Your generated itinerary will appear here.</p>
            </div>
          ) : (
            <div>
              <span className="text-xs font-semibold uppercase text-white/48">{itinerary.destination}</span>
              <h2 className="mt-3 text-4xl">{itinerary.tripSummary}</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <Info label="Budget" value={itinerary.estimatedBudget} />
                <Info label="Best time" value={itinerary.bestTimeToVisit} />
              </div>

              <div className="mt-8 space-y-5">
                {itinerary.days?.map((day) => (
                  <article key={day.day} className="rounded-[20px] border border-white/12 bg-black/20 p-5">
                    <h3 className="text-2xl">Day {day.day}: {day.title}</h3>
                    <div className="mt-4 space-y-3">
                      {day.activities?.map((activity, index) => (
                        <div key={`${day.day}-${index}`} className="rounded-2xl bg-white/[0.06] p-4">
                          <span className="text-xs font-semibold uppercase text-white/42">{activity.time}</span>
                          <h4 className="mt-1 text-lg text-white">{activity.activity}</h4>
                          <p className="mt-1 text-sm leading-6 text-white/58">{activity.description}</p>
                        </div>
                      ))}
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
    <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
      <span className="text-xs font-semibold uppercase text-white/42">{label}</span>
      <p className="mt-1 text-sm leading-6 text-white/76">{value || "Not available"}</p>
    </div>
  );
}
