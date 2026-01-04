import React from "react";
import "./TradeInSection.css";

export interface PhoneInfo {
  phoneId?: string;
  phoneBrand: string;
  phoneModel: string;
}

interface TradeInSectionProps {
  phoneInfo?: PhoneInfo;
  onTradeInSelect?: (hasTradeIn: boolean) => void;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({
  phoneInfo,
  onTradeInSelect,
}) => {
  return (
    <div className="trade-in-section">
      <p className="trade-in-title">DO YOU HAVE A DEVICE TO TRADE IN?</p>
      <p className="trade-in-phone-id">
        Phone: {phoneInfo?.phoneBrand} {phoneInfo?.phoneModel}
      </p>
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
