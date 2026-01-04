import React, { useState } from "react";
import "./TradeInModal.css";
import { PhoneInfo } from "./TradeInSection";

interface TradeInModalProps {
  isOpen: boolean;
  phoneInfo?: PhoneInfo;
  onClose: () => void;
}

interface TradeInOfferResponse {
  selectedPhoneId: string;
  tradeinPhoneBrand: string;
  tradeinModel: string;
  tradeinValue: string;
  tradeinPromotion: string;
}

const brandNames: { [key: string]: string } = {
  apple: "Apple",
  google: "Google",
  samsung: "Samsung",
};

const TradeInModal: React.FC<TradeInModalProps> = ({
  isOpen,
  phoneInfo,
  onClose,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [step, setStep] = useState<"selection" | "offer">("selection");
  const [offerData, setOfferData] = useState<TradeInOfferResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel(""); // Reset model when brand changes
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/trade-in-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPhoneId: phoneInfo?.phoneId,
          tradeinPhoneBrand: brandNames[selectedBrand],
          tradeinModel: selectedModel,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setOfferData(result.data);
        setStep("offer");
      }
    } catch (error) {
      console.error("Error fetching trade-in offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    console.log("Trade-in accepted:", offerData);
    onClose();
  };

  const handleBack = () => {
    setStep("selection");
  };

  if (!isOpen) return null;

  return (
    <div className="trade-in-modal-overlay" onClick={onClose}>
      <div className="trade-in-modal" onClick={(e) => e.stopPropagation()}>
        <button className="trade-in-modal__close" onClick={onClose}>
          ×
        </button>

        <div className="trade-in-modal__content">
          {/* Display current phone info */}
          <div className="trade-in-modal__phone-info">
            <p>
              <strong>Trading in for:</strong> {phoneInfo?.phoneBrand}{" "}
              {phoneInfo?.phoneModel}
            </p>
          </div>

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

          {/* Step 1: Selection */}
          {step === "selection" && (
            <>
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
                  <label className="trade-in-modal__label">
                    Select a device
                  </label>
                  <select
                    className="trade-in-modal__select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="">Device model</option>
                    {selectedBrand === "apple" && (
                      <>
                        <option value="iPhone-15-Pro-Max">
                          iPhone 15 Pro Max
                        </option>
                        <option value="iPhone-15-Pro">iPhone 15 Pro</option>
                        <option value="iPhone-15">iPhone 15</option>
                        <option value="iPhone-14-Pro-Max">
                          iPhone 14 Pro Max
                        </option>
                        <option value="iPhone-14-Pro">iPhone 14 Pro</option>
                        <option value="iPhone-14">iPhone 14</option>
                        <option value="iPhone-13-Pro-Max">
                          iPhone 13 Pro Max
                        </option>
                        <option value="iPhone-13-Pro">iPhone 13 Pro</option>
                        <option value="iPhone-13">iPhone 13</option>
                        <option value="iPhone-12-Pro-Max">
                          iPhone 12 Pro Max
                        </option>
                        <option value="iPhone-12-Pro">iPhone 12 Pro</option>
                        <option value="iPhone-12">iPhone 12</option>
                      </>
                    )}
                    {selectedBrand === "google" && (
                      <>
                        <option value="Pixel-9-Pro">Pixel 9 Pro</option>
                        <option value="Pixel-9">Pixel 9</option>
                        <option value="Pixel-8-Pro">Pixel 8 Pro</option>
                        <option value="Pixel-8">Pixel 8</option>
                        <option value="Pixel-7-Pro">Pixel 7 Pro</option>
                        <option value="Pixel-7">Pixel 7</option>
                        <option value="Pixel-6-Pro">Pixel 6 Pro</option>
                        <option value="Pixel-6">Pixel 6</option>
                      </>
                    )}
                    {selectedBrand === "samsung" && (
                      <>
                        <option value="Galaxy-S24-Ultra">
                          Galaxy S24 Ultra
                        </option>
                        <option value="Galaxy-S24-Plus">Galaxy S24 Plus</option>
                        <option value="Galaxy-S24">Galaxy S24</option>
                        <option value="Galaxy-S23-Ultra">
                          Galaxy S23 Ultra
                        </option>
                        <option value="Galaxy-S23-Plus">Galaxy S23 Plus</option>
                        <option value="Galaxy-S23">Galaxy S23</option>
                        <option value="Galaxy-S22-Ultra">
                          Galaxy S22 Ultra
                        </option>
                        <option value="Galaxy-S22-Plus">Galaxy S22 Plus</option>
                        <option value="Galaxy-S22">Galaxy S22</option>
                      </>
                    )}
                  </select>
                </>
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
                  onClick={handleNext}
                  disabled={!selectedBrand || !selectedModel || loading}
                >
                  {loading ? "Loading..." : "Next"}
                </button>
              </div>
            </>
          )}

          {/* Step 2: Offer Display */}
          {step === "offer" && offerData && (
            <>
              <div className="trade-in-modal__offer">
                <h3 className="trade-in-modal__offer-title">
                  Your Trade-In Offer
                </h3>
                <div className="trade-in-modal__offer-details">
                  <div className="trade-in-modal__offer-item">
                    <span className="trade-in-modal__offer-label">
                      Trade-In Value:
                    </span>
                    <span className="trade-in-modal__offer-value">
                      {offerData.tradeinValue}
                    </span>
                  </div>
                  <div className="trade-in-modal__offer-item">
                    <span className="trade-in-modal__offer-label">
                      Promotion Bonus:
                    </span>
                    <span className="trade-in-modal__offer-value trade-in-modal__offer-value--promo">
                      {offerData.tradeinPromotion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="trade-in-modal__buttons">
                <button
                  className="trade-in-modal__btn trade-in-modal__btn--close"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="trade-in-modal__btn trade-in-modal__btn--accept"
                  onClick={handleAccept}
                >
                  Accept
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeInModal;
