import React from "react";
import "./ReasonsToSwitchSection.scss";

interface Reason {
  id: number;
  icon: string;
  title: string;
  description: string;
  linkText: string;
}

const ReasonsToSwitchSection: React.FC = () => {
  const reasons: Reason[] = [
    {
      id: 1,
      icon: "🛡️",
      title: "Spectrum Mobile Insurance",
      description:
        "Protect your device from the unexpected with Spectrum Mobile Insurance.",
      linkText: "See Details",
    },
    {
      id: 2,
      icon: "✈️",
      title: "Traveling Abroad",
      description:
        "Take your phone abroad with international calling and data options.",
      linkText: "View international rates",
    },
    {
      id: 3,
      icon: "📱",
      title: "Upgrade Your Phone",
      description:
        "Ready for something new? Check out the latest phones and upgrade options available today.",
      linkText: "See devices",
    },
  ];

  return (
    <section className="reasons-to-switch-section">
      <div className="reasons-to-switch-section__container">
        <h2 className="reasons-to-switch-section__title">
          Need More Reasons to Switch?
        </h2>

        <div className="reasons-to-switch-section__cards">
          {reasons.map((reason) => (
            <div key={reason.id} className="reason-card">
              <div className="reason-card__icon">{reason.icon}</div>
              <h3 className="reason-card__title">{reason.title}</h3>
              <p className="reason-card__description">{reason.description}</p>
              <a href="#" className="reason-card__link">
                {reason.linkText} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReasonsToSwitchSection;
