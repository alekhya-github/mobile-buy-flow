import React from "react";
import HeroSection from "./HeroSection/HeroSection";
import PlansSection from "./PlansSection/PlansSection";
import PhoneDealsCarousel from "./PhoneDealsCarousel/PhoneDealsCarousel";
import NetworkCoverageSection from "./NetworkCoverageSection/NetworkCoverageSection";
import SavingsComparisonTable from "./SavingsComparisonTable/SavingsComparisonTable";
import FeaturesGrid from "./FeaturesGrid/FeaturesGrid";
import ReasonsToSwitchSection from "./ReasonsToSwitchSection/ReasonsToSwitchSection";
import "./Home.scss";

const Home: React.FC = () => {
  return (
    <div className="home">
      <HeroSection />
      <PlansSection />
      <PhoneDealsCarousel />
      <NetworkCoverageSection />
      <SavingsComparisonTable />
      <FeaturesGrid />
      <ReasonsToSwitchSection />
    </div>
  );
};

export default Home;
