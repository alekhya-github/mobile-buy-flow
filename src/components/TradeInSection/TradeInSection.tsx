import React from "react";
import "./TradeInSection.css";

interface TradeInSectionProps {
  onTradeInSelect?: (hasTradeIn: boolean) => void;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({ onTradeInSelect }) => {
  return (
    <div className="trade-in-section">
      <p className="trade-in-title">DO YOU HAVE A DEVICE TO TRADE IN?</p>
      <div className="trade-in-buttons">
        <button
          className="trade-in-btn"
          onClick={() => onTradeInSelect?.(true)}
        >
          Yes
        </button>
        <button
          className="trade-in-btn"
          onClick={() => onTradeInSelect?.(false)}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default TradeInSection;
