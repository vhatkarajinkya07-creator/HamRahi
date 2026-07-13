
// don't touch 
//      -AJINKYA


import Hero from "../../components/Hero/Hero";
import ThemeSection from "../../components/ThemeSection/ThemeSection";
import GlobeSection from "../../components/GlobeSection/GlobeSection";
import DestinationSearch from "../../components/DestinationSearch/DestinationSearch";

export default function Home() {
  return (
    <>
      <Hero />
      <DestinationSearch />
      <ThemeSection/>
      <GlobeSection/>
    </>
  );
}
