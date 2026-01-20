import React from "react";
import "./FeaturesGrid.scss";

interface Feature {
  id: number;
  title: string;
  description: string;
  linkText: string;
  badge?: string;
}

const FeaturesGrid: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      badge: "IT PAYS TO SWITCH",
      title: "Feeling Stuck with Your Mobile Provider?",
      description:
        "Let us pay your early termination fee up to $500 per line and make the switch easy.",
      linkText: "Explore Buyout",
    },
    {
      id: 2,
      title: "Bring Your Own Device",
      description:
        "Keep your compatible device and save even more when you switch to Spectrum Mobile.",
      linkText: "Check compatibility",
    },
    {
      id: 3,
      title: "Trade-In and Save",
      description:
        "Let us trade your old phone and put the value towards a new one with our Trade-In program.",
      linkText: "Explore trade-in",
    },
    {
      id: 4,
      title: "Better Mobile. Happier Customers.",
      description:
        "Experience our commitment to quality and customer service that keeps our customers happy.",
      linkText: "Explore perks",
    },
  ];

  return (
    <section className="features-grid">
      <div className="features-grid__container">
        <div className="features-grid__cards">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-card__image">
                {feature.badge && (
                  <div className="feature-card__badge">{feature.badge}</div>
                )}
                <span className="feature-card__placeholder">🖼️</span>
              </div>
              <div className="feature-card__content">
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">
                  {feature.description}
                </p>
                <a href="#" className="feature-card__link">
                  {feature.linkText} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
