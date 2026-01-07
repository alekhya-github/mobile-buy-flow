import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./IdentityProtection.scss";

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
  };

  const handleGoBack = () => {
    navigate("/mobile/sign-in", { state });
  };

  return (
    <div className="identity-protection">
      <div className="identity-protection__container">
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
  );
};

export default IdentityProtection;
