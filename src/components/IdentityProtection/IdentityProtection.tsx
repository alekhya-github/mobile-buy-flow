import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./IdentityProtection.scss";
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
  userInfo?: {
    username: string;
    password: string;
    isAuthenticated: boolean;
    staySignedIn: boolean;
  };
}

type IdentificationType = "ssn" | "taxId";

const IdentityProtection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Get phone selection from context (shopping cart)
  const { state: buyFlowState } = useMobileBuyFlow();
  const { phoneDetails, tradeInDetails } = buyFlowState;

  const [identificationType, setIdentificationType] =
    useState<IdentificationType>("ssn");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!identificationNumber.trim()) {
      setError("Please enter your identification number");
      return;
    }

    // Validate based on type
    if (identificationType === "ssn") {
      // Basic SSN validation (9 digits)
      const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
      if (!ssnPattern.test(identificationNumber)) {
        setError("Please enter a valid Social Security Number (XXX-XX-XXXX)");
        return;
      }
    } else {
      // Basic Tax ID validation (9 digits)
      const taxIdPattern = /^\d{2}-?\d{7}$/;
      if (!taxIdPattern.test(identificationNumber)) {
        setError("Please enter a valid Tax ID Number (XX-XXXXXXX)");
        return;
      }
    }

    // Store identity verification info temporarily
    const identityInfo = {
      identificationType,
      identificationNumber,
      verified: true,
    };

    // Save to sessionStorage for temporary storage
    sessionStorage.setItem("identityInfo", JSON.stringify(identityInfo));

    // Navigate to checkout with all accumulated data
    navigate("/mobile/checkout", {
      state: {
        ...state,
        identityInfo,
      },
    });
    // Route to plans page after successful validation
    navigate("/plans");
  };

  const handleGoBack = () => {
    navigate("/mobile/sign-in", { state });
  };

  return (
    <div className="identity-protection">
      <div className="identity-protection__layout">
        {/* Left Side - Phone Selection Summary */}
        <div className="identity-protection__phone-summary">
          <h2 className="identity-protection__summary-title">Your Selection</h2>

          {phoneDetails.phoneImage && (
            <div className="identity-protection__phone-image">
              <img
                src={phoneDetails.phoneImage}
                alt={`${phoneDetails.phoneBrand} ${phoneDetails.phoneModel}`}
              />
            </div>
          )}

          <div className="identity-protection__phone-info">
            <h3 className="identity-protection__phone-brand">
              {phoneDetails.phoneBrand || "No phone selected"}
            </h3>
            <p className="identity-protection__phone-model">
              {phoneDetails.phoneModel}
            </p>

            {phoneDetails.selectedColor && (
              <div className="identity-protection__detail-row">
                <span className="identity-protection__detail-label">
                  Color:
                </span>
                <span className="identity-protection__detail-value">
                  {phoneDetails.selectedColor}
                </span>
              </div>
            )}

            {phoneDetails.selectedStorage && (
              <div className="identity-protection__detail-row">
                <span className="identity-protection__detail-label">
                  Storage:
                </span>
                <span className="identity-protection__detail-value">
                  {phoneDetails.selectedStorage}
                </span>
              </div>
            )}

            {phoneDetails.monthlyPrice && (
              <div className="identity-protection__detail-row">
                <span className="identity-protection__detail-label">
                  Monthly:
                </span>
                <span className="identity-protection__detail-value">
                  ${phoneDetails.monthlyPrice}/mo
                </span>
              </div>
            )}

            {phoneDetails.fullPrice && (
              <div className="identity-protection__detail-row">
                <span className="identity-protection__detail-label">
                  Full Price:
                </span>
                <span className="identity-protection__detail-value">
                  {phoneDetails.fullPrice}
                </span>
              </div>
            )}

            {tradeInDetails.hasTradeIn && (
              <div className="identity-protection__trade-in">
                <p className="identity-protection__trade-in-label">Trade-In:</p>
                <p className="identity-protection__trade-in-device">
                  {tradeInDetails.tradeInDevice}
                </p>
                <p className="identity-protection__trade-in-value">
                  Credit: {tradeInDetails.tradeInValue}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="identity-protection__content">
          <h1 className="identity-protection__title">Identity Protection</h1>
          <p className="identity-protection__subtitle">
            Are you <strong>EXTREMELY EXCITED?</strong>
            <br />
            To ensure your account is secure, we need to verify your identity.
          </p>

          <div className="identity-protection__form">
            <h2 className="identity-protection__section-title">
              Identification Number
            </h2>

            <div className="identity-protection__radio-group">
              <label className="identity-protection__radio-label">
                <input
                  type="radio"
                  name="identificationType"
                  value="ssn"
                  checked={identificationType === "ssn"}
                  onChange={(e) =>
                    setIdentificationType(e.target.value as IdentificationType)
                  }
                  className="identity-protection__radio"
                />
                <span>Social Security Number</span>
              </label>

              <label className="identity-protection__radio-label">
                <input
                  type="radio"
                  name="identificationType"
                  value="taxId"
                  checked={identificationType === "taxId"}
                  onChange={(e) =>
                    setIdentificationType(e.target.value as IdentificationType)
                  }
                  className="identity-protection__radio"
                />
                <span>Tax ID Number</span>
              </label>
            </div>

            <div className="identity-protection__input-group">
              <input
                type="text"
                className={`identity-protection__input ${
                  error ? "identity-protection__input--error" : ""
                }`}
                placeholder={
                  identificationType === "ssn" ? "XXX-XX-XXXX" : "XX-XXXXXXX"
                }
                value={identificationNumber}
                onChange={(e) => {
                  setIdentificationNumber(e.target.value);
                  setError("");
                }}
                maxLength={identificationType === "ssn" ? 11 : 10}
              />
              {error && (
                <span className="identity-protection__error">{error}</span>
              )}
            </div>

            <button
              className="identity-protection__continue-btn"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>

          <button
            className="identity-protection__back-link"
            onClick={handleGoBack}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityProtection;
