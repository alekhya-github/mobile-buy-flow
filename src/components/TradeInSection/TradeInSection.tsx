import React from "react";
import "./TradeInSection.css";

export interface PhoneInfo {
  phoneId?: string;
  phoneBrand: string;
  phoneModel: string;
}

export interface TradeInOffer {
  tradeinValue: string;
  tradeinPromotion: string;
  tradeinPhoneBrand: string;
  tradeinModel: string;
}

interface TradeInSectionProps {
  phoneInfo?: PhoneInfo;
  acceptedOffer?: TradeInOffer | null;
  onTradeInSelect?: (hasTradeIn: boolean) => void;
  onRemove?: () => void;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({
  phoneInfo,
  acceptedOffer,
  onTradeInSelect,
  onRemove,
}) => {
  return (
    <div className="trade-in-section">
      <p className="trade-in-title">DO YOU HAVE A DEVICE TO TRADE IN?</p>
      <p className="trade-in-phone-id">
        Phone: {phoneInfo?.phoneBrand} {phoneInfo?.phoneModel}
      </p>

      {acceptedOffer ? (
        <div className="trade-in-accepted">
          <div className="trade-in-accepted__header">
            <span>Trade-in Device:</span>
            <span className="trade-in-accepted__remove" onClick={onRemove}>
              Remove
            </span>
          </div>
          <div className="trade-in-accepted__device">
            <strong>
              {acceptedOffer.tradeinPhoneBrand} {acceptedOffer.tradeinModel}
            </strong>
          </div>
          <div className="trade-in-accepted__values">
            <div className="trade-in-accepted__item">
              <span>Trade-In Value:</span>
              <strong>{acceptedOffer.tradeinValue}</strong>
            </div>
            <div className="trade-in-accepted__item trade-in-accepted__item--promo">
              <span>Promotion Bonus:</span>
              <strong>{acceptedOffer.tradeinPromotion}</strong>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TradeInSection;
