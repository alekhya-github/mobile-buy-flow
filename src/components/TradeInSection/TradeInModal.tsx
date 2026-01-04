import React from "react";
import "./TradeInModal.css";

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradeInModal: React.FC<TradeInModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="trade-in-modal-overlay" onClick={onClose}>
      <div className="trade-in-modal" onClick={(e) => e.stopPropagation()}>
        <button className="trade-in-modal__close" onClick={onClose}>
          ×
        </button>
        <h2 className="trade-in-modal__heading">Follow TradeIn</h2>
      </div>
    </div>
  );
};

export default TradeInModal;
