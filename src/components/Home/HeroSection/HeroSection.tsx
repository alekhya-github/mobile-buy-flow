import React, { useState, useEffect } from "react";
import "./HeroSection.scss";
import {
  fetchHeroSectionData,
  HeroSectionData,
} from "../../../services/heroSectionService";

// Fallback data when AEM is unavailable
const DEFAULT_HERO_DATA: HeroSectionData = {
  badge: "NEW",
  title: "Welcome to Our Mobile Store",
  subtitle: "Discover the latest smartphones with amazing deals and offers",
  ctaLabel: "Shop Now",
  ctaLink: "/mobile/phones",
};

const HeroSection: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setLoading(true);
        const data = await fetchHeroSectionData();
        setHeroData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch hero section data",
        );
        console.error("Error fetching hero section data:", err);
        // Use fallback data instead of breaking the page
        setHeroData(DEFAULT_HERO_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-section__container">
          <div className="hero-section__content">Loading...</div>
        </div>
      </section>
    );
  }

  // Always use fallback if heroData is null (shouldn't happen with our error handling)
  const displayData = heroData || DEFAULT_HERO_DATA;

  const AEM_PUBLISH_HOST = "http://localhost:4503";
  const backgroundImageUrl = displayData.imagepath?._path
    ? `${AEM_PUBLISH_HOST}${displayData.imagepath._path}`
    : "";

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: backgroundImageUrl
          ? `url('${backgroundImageUrl}')`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hero-section__container">
        <div className="hero-section__content">
          {error && (
            <div
              className="hero-section__notice"
              style={{
                fontSize: "0.8rem",
                color: "#ffc107",
                marginBottom: "0.5rem",
              }}
            >
              Using default content (AEM unavailable)
            </div>
          )}
          <div className="hero-section__badge">{displayData.badge}</div>
          <h1 className="hero-section__title">{displayData.title}</h1>
          <p className="hero-section__subtitle">{displayData.subtitle}</p>
          <button
            className="hero-section__cta"
            onClick={() => {
              if (displayData.ctaLink) {
                window.location.href = displayData.ctaLink;
              }
            }}
          >
            {displayData.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
