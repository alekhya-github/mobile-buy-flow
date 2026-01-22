import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CustomerCheck.scss";
// Import the context hook to read phone selection
import { useMobileBuyFlow } from "../../context/PhoneSelectionContext";

interface LocationState {
  phoneId?: string;
  phoneBrand?: string;
  phoneModel?: string;
  selectedColor?: string;
  selectedStorage?: string;
  tradeInOffer?: {
    tradeinValue: number;
    tradeinPromotion: number;
    tradeinPhoneBrand: string;
    tradeinModel: string;
  } | null;
}

const CustomerCheck: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Get phone selection from context (shopping cart)
  const { state: buyFlowState } = useMobileBuyFlow();
  const { phoneDetails, tradeInDetails } = buyFlowState;

  const handleSignIn = () => {
    // Navigate to sign in page
    navigate("/mobile/sign-in", { state });
  };

  const handleShopInternet = () => {
    // Navigate to internet shopping page
    window.open("https://www.spectrum.com/internet", "_blank");
  };

  const handleGoBack = () => {
    if (state?.phoneId) {
      navigate(`/mobile/phone/${state.phoneId}`);
    } else {
      navigate("/mobile/phones");
    }
  };

  return (
    <div className="customer-check">
      <div className="customer-check__layout">
        {/* Left Side - Phone Selection Summary */}
        <div className="customer-check__phone-summary">
          <h2 className="customer-check__summary-title">Your Selection</h2>

          {phoneDetails.phoneImage && (
            <div className="customer-check__phone-image">
              <img
                src={phoneDetails.phoneImage}
                alt={`${phoneDetails.phoneBrand} ${phoneDetails.phoneModel}`}
              />
            </div>
          )}

          <div className="customer-check__phone-info">
            <h3 className="customer-check__phone-brand">
              {phoneDetails.phoneBrand || "No phone selected"}
            </h3>
            <p className="customer-check__phone-model">
              {phoneDetails.phoneModel}
            </p>

            {phoneDetails.selectedColor && (
              <div className="customer-check__detail-row">
                <span className="customer-check__detail-label">Color:</span>
                <span className="customer-check__detail-value">
                  {phoneDetails.selectedColor}
                </span>
              </div>
            )}

            {phoneDetails.selectedStorage && (
              <div className="customer-check__detail-row">
                <span className="customer-check__detail-label">Storage:</span>
                <span className="customer-check__detail-value">
                  {phoneDetails.selectedStorage}
                </span>
              </div>
            )}

            {phoneDetails.monthlyPrice && (
              <div className="customer-check__detail-row">
                <span className="customer-check__detail-label">Monthly:</span>
                <span className="customer-check__detail-value">
                  ${phoneDetails.monthlyPrice}/mo
                </span>
              </div>
            )}

            {phoneDetails.fullPrice && (
              <div className="customer-check__detail-row">
                <span className="customer-check__detail-label">
                  Full Price:
                </span>
                <span className="customer-check__detail-value">
                  {phoneDetails.fullPrice}
                </span>
              </div>
            )}

            {tradeInDetails.hasTradeIn && (
              <div className="customer-check__trade-in">
                <p className="customer-check__trade-in-label">Trade-In:</p>
                <p className="customer-check__trade-in-device">
                  {tradeInDetails.tradeInDevice}
                </p>
                <p className="customer-check__trade-in-value">
                  Credit: {tradeInDetails.tradeInValue}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="customer-check__content">
          <h1 className="customer-check__title">
            Are You a Spectrum Customer?
          </h1>
          <p className="customer-check__subtitle">
            Sign in to continue. If you're new to Spectrum Mobile®, please note
            that Internet is required to purchase Mobile.
          </p>

          <div className="customer-check__buttons">
            <button
              className="customer-check__btn customer-check__btn--primary"
              onClick={handleSignIn}
            >
              Yes, sign in
            </button>
            <button
              className="customer-check__btn customer-check__btn--secondary"
              onClick={handleShopInternet}
            >
              No, Shop Internet
            </button>
          </div>

          <button className="customer-check__back-link" onClick={handleGoBack}>
            ← Back to Phone Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCheck;
