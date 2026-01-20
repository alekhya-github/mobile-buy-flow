import React from "react";
import "./NetworkCoverageSection.scss";

const NetworkCoverageSection: React.FC = () => {
  return (
    <section className="network-coverage-section">
      <div className="network-coverage-section__container">
        <div className="network-coverage-section__content">
          <h2 className="network-coverage-section__title">
            Our Network Covers 99% of the U.S. Population
          </h2>
          <button className="network-coverage-section__cta">
            View coverage map
          </button>
        </div>
        <div className="network-coverage-section__map">
          <div className="us-map-placeholder">
            <span className="us-map-placeholder__icon">🗺️</span>
            <span className="us-map-placeholder__text">USA Coverage Map</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkCoverageSection;
