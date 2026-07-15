// Wishlist.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import api from "../../services/api";
import { mapDestinationDetails } from "../../services/destinationMapper";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/wishlist");
      setItems(Array.isArray(data) ? data.map(mapDestinationDetails) : []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (placeId) => {
    try {
      await api.delete(`/wishlist/${placeId}`);
      setItems((current) => current.filter((item) => item.placeId !== placeId));
    } catch (err) {
      setError("Could not remove item from wishlist.");
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-6 pb-24 pt-[130px] transition-colors duration-300">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-[var(--border-subtle)] pb-8 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Saved spots</span>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Wishlist</h1>
          </div>
          <Button
            label="Refresh Board"
            icon="pi pi-refresh"
            outlined
            onClick={loadWishlist}
            loading={loading}
            className="border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 px-5 py-3 font-bold text-sm rounded-xl"
          />
        </div>

        {error && <Message severity="error" text={error} className="mt-6 w-full" />}

        {!loading && !error && items.length === 0 && (
          <div className="mt-12 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-16 text-center shadow-sm max-w-[620px] mx-auto">
            <i className="pi pi-heart text-6xl text-[var(--text-secondary)]/30 mb-5 block" />
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">No saved destinations yet</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-3 mb-8 leading-6">Start exploring destinations around the globe to save them to your map.</p>
            <Button as={Link} to="/#destinations" label="Explore destinations" icon="pi pi-compass" className="font-bold px-6 py-3.5 rounded-full" />
          </div>
        )}

        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.placeId}
              className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:scale-[1.01]"
            >
              <div className="relative h-[250px] overflow-hidden">
                <img
                  src={item.heroImage}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white pr-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/80">{item.country}</span>
                  <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white leading-tight drop-shadow-sm">{item.name}</h2>
                </div>
              </div>
              
              <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    {item.tagline || `Discover the culture, food, and atmospheres of ${item.name}.`}
                  </p>
                  {item.weather?.temperature && (
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] px-3.5 py-1.5 text-xs font-bold text-[var(--text-primary)] shrink-0 shadow-sm">
                      {Math.round(item.weather.temperature)}°C
                    </span>
                  )}
                </div>
                
                {/* Action Buttons (Standard HTML buttons for perfect sizing & links) */}
                <div className="mt-auto flex items-center gap-3.5">
                  <Link
                    to={`/destination/${item.placeId}`}
                    className="flex-1 flex h-[52px] items-center justify-center gap-2.5 rounded-[18px] bg-[var(--text-primary)] px-6 text-sm font-bold text-[var(--bg-base)] transition-all hover:opacity-90 active:scale-95 shadow-sm"
                  >
                    <i className="pi pi-arrow-right text-[11px]" />
                    <span>Open Details</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.placeId)}
                    className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-red-500/20 bg-red-500/5 text-red-500 transition-all hover:bg-red-500/10 hover:border-red-500/40 active:scale-95 shrink-0"
                    aria-label="Remove from wishlist"
                  >
                    <i className="pi pi-trash text-[16px]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
