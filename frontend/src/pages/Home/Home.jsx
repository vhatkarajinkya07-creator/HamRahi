
// don't touch 
//      -AJINKYA


import { useState } from "react";
import Hero from "../../components/Hero/Hero";
import ThemeSection from "../../components/ThemeSection/ThemeSection";
import GlobeSection from "../../components/GlobeSection/GlobeSection";
import DestinationSearch from "../../components/DestinationSearch/DestinationSearch";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <div className="relative">
        <Hero />
        <div 
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg-base)] z-10"
          aria-hidden="true"
        />
      </div>
      <ThemeSection setSelectedCategory={setSelectedCategory} />
      <DestinationSearch />
      <GlobeSection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
    </>
  );
}
