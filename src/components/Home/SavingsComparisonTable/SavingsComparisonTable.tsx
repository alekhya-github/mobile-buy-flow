import React from "react";
import "./SavingsComparisonTable.scss";

const SavingsComparisonTable: React.FC = () => {
  return (
    <section className="savings-comparison-table">
      <div className="savings-comparison-table__container">
        <h2 className="savings-comparison-table__title">
          Save Over $1,000 with Spectrum One
        </h2>
        <p className="savings-comparison-table__subtitle">
          Bundle internet with two Mobile lines for the exceptional savings.
        </p>

        <div className="savings-comparison-table__image-wrapper">
          <div className="table-image-placeholder">
            <span className="table-image-placeholder__icon">📊</span>
            <span className="table-image-placeholder__text">
              Comparison Table Image
            </span>
            <p className="table-image-placeholder__detail">
              Spectrum vs AT&T, Verizon, T-Mobile pricing comparison
            </p>
          </div>
        </div>

        <div className="savings-comparison-table__disclaimer">
          <p>
            <small>
              Based on 2-line pricing for comparable unlimited plans as of
              [Date]. Spectrum Mobile requires Spectrum Internet. Taxes and fees
              included. Competitors' prices exclude taxes and fees. See website
              for full details.
            </small>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SavingsComparisonTable;
