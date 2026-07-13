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
    await api.delete(`/wishlist/${placeId}`);
    setItems((current) => current.filter((item) => item.placeId !== placeId));
  };

  return (
    <section className="min-h-screen bg-[#050505] px-5 pb-20 pt-[120px] text-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-white/48">Saved places</span>
            <h1 className="mt-3 text-5xl">Wishlist</h1>
          </div>
          <Button label="Refresh" icon="pi pi-refresh" outlined onClick={loadWishlist} loading={loading} />
        </div>

        {error && <Message severity="error" text={error} className="mt-8 w-full" />}

        {!loading && !error && items.length === 0 && (
          <div className="mt-10 rounded-[28px] border border-white/14 bg-white/[0.08] p-8 text-center backdrop-blur-3xl">
            <h2 className="text-2xl">No saved destinations yet</h2>
            <Button as={Link} to="/#destinations" label="Explore destinations" icon="pi pi-compass" className="mt-5" />
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.placeId} className="overflow-hidden rounded-[24px] border border-white/14 bg-white/[0.08] backdrop-blur-3xl">
              <img src={item.heroImage} alt={item.name} className="h-[220px] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl">{item.name}</h2>
                    <p className="mt-1 text-sm text-white/52">{item.country}</p>
                  </div>
                  {item.weather?.temperature && (
                    <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs text-white/70">
                      {Math.round(item.weather.temperature)} C
                    </span>
                  )}
                </div>
                <div className="mt-5 flex gap-3">
                  <Button as={Link} to={`/destination/${item.placeId}`} label="Open" icon="pi pi-arrow-right" className="flex-1" />
                  <Button icon="pi pi-trash" severity="danger" outlined aria-label="Remove" onClick={() => removeItem(item.placeId)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
