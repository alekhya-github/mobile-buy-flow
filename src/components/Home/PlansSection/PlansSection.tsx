import React from "react";
import "./PlansSection.scss";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: number;
  perLine: string;
  isFavorite?: boolean;
  features: PlanFeature[];
}

const PlansSection: React.FC = () => {
  const plans: Plan[] = [
    {
      name: "Unlimited",
      price: 30,
      perLine: "per line",
      features: [
        {
          text: "Unlimited talk, text and data while on the Spectrum Mobile Network",
        },
        { text: "5G access included at no extra cost" },
        { text: "Mobile Hotspot: Unlimited data" },
        { text: "Includes taxes and fees" },
        { text: "No annual service contracts" },
        { text: "Keep your current phone or buy a new one" },
      ],
    },
    {
      name: "Unlimited Plus",
      price: 40,
      perLine: "per line",
      isFavorite: true,
      features: [
        {
          text: "Unlimited talk, text and premium data while on both Spectrum Mobile and Nationwide networks",
        },
        { text: "5G access included at no extra cost" },
        { text: "SD streaming video" },
        {
          text: "100 GB Mobile Hotspot: Premium network access. After 100 GB, speeds reduced to max of 3 Mbps",
        },
        { text: "Includes taxes and fees" },
        { text: "No annual service contracts" },
        { text: "Keep your current phone or buy a new one" },
      ],
    },
  ];

  return (
    <section className="plans-section">
      <div className="plans-section__container">
        <h2 className="plans-section__title">
          Unlimited Data. Reliable Coverage.
        </h2>
        <p className="plans-section__subtitle">
          Pick the perfect option for you from plans starting at just
          $29.99/line with taxes and fees included for those who qualify.
        </p>

        <div className="plans-section__cards">
          {plans.map((plan, index) => (
            <div key={index} className="plan-card">
              {plan.isFavorite && (
                <div className="plan-card__badge">Customers' Fave!</div>
              )}
              <h3 className="plan-card__name">{plan.name}</h3>
              <div className="plan-card__pricing">
                <span className="plan-card__currency">$</span>
                <span className="plan-card__price">{plan.price}</span>
                <span className="plan-card__per-line">/{plan.perLine}</span>
              </div>
              <button className="plan-card__cta">Add this plan</button>
              <ul className="plan-card__features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="plan-card__feature">
                    <span className="plan-card__checkmark">✓</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
