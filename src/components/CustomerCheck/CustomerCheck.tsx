import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CustomerCheck.scss";

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
      <div className="customer-check__container">
        <h1 className="customer-check__title">Are You a Spectrum Customer?</h1>
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
  );
};

export default CustomerCheck;
