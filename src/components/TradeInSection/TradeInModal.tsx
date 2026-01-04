import React, { useState } from "react";
import "./TradeInModal.css";

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const brandNames: { [key: string]: string } = {
  apple: "Apple",
  google: "Google",
  samsung: "Samsung Galaxy",
};

const TradeInModal: React.FC<TradeInModalProps> = ({ isOpen, onClose }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel(""); // Reset model when brand changes
  };

  const handleAccept = () => {
    console.log("Trade-in accepted:", {
      brand: selectedBrand,
      model: selectedModel,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="trade-in-modal-overlay" onClick={onClose}>
      <div className="trade-in-modal" onClick={(e) => e.stopPropagation()}>
        <button className="trade-in-modal__close" onClick={onClose}>
          ×
        </button>

        <div className="trade-in-modal__content">
          <label className="trade-in-modal__label">Select a brand</label>
          <select
            className="trade-in-modal__select"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="">Device manufacturer</option>
            <option value="apple">Apple</option>
            <option value="google">Google</option>
            <option value="samsung">Samsung Galaxy</option>
          </select>

          {selectedBrand && (
            <>
              <label className="trade-in-modal__label">Select a device</label>
              <select
                className="trade-in-modal__select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">Device model</option>
                {selectedBrand === "apple" && (
                  <>
                    <option value="iPhone 17">iPhone 17</option>
                    <option value="iPhone 17 Pro">iPhone 17 Pro</option>
                    <option value="iPhone 17 Pro Max">iPhone 17 Pro Max</option>
                    <option value="iPhone 16">iPhone 16</option>
                    <option value="iPhone 16 Pro">iPhone 16 Pro</option>
                  </>
                )}
                {selectedBrand === "google" && (
                  <>
                    <option value="Pixel 9">Pixel 9</option>
                    <option value="Pixel 9 Pro">Pixel 9 Pro</option>
                    <option value="Pixel 8">Pixel 8</option>
                    <option value="Pixel 8 Pro">Pixel 8 Pro</option>
                  </>
                )}
                {selectedBrand === "samsung" && (
                  <>
                    <option value="Galaxy S25">Galaxy S25</option>
                    <option value="Galaxy S25 Ultra">Galaxy S25 Ultra</option>
                    <option value="Galaxy S24">Galaxy S24</option>
                    <option value="Galaxy Z Fold">Galaxy Z Fold</option>
                  </>
                )}
              </select>
            </>
          )}

          {/* Display selected values */}
          {(selectedBrand || selectedModel) && (
            <div className="trade-in-modal__selection">
              <p>
                <strong>Selected Brand:</strong>{" "}
                {brandNames[selectedBrand] || "-"}
              </p>
              <p>
                <strong>Selected Model:</strong> {selectedModel || "-"}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="trade-in-modal__buttons">
            <button
              className="trade-in-modal__btn trade-in-modal__btn--close"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="trade-in-modal__btn trade-in-modal__btn--accept"
              onClick={handleAccept}
              disabled={!selectedBrand || !selectedModel}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInModal;
