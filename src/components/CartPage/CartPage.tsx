import React from "react";
import { useLocation } from "react-router-dom";
import "./CartPage.scss";

const CartPage: React.FC = () => {
  const location = useLocation();
  // Try to get cart data from location state first, then from localStorage
  let cartData = location.state?.cartData;

  if (!cartData) {
    const storedData = localStorage.getItem("cartData");
    cartData = storedData ? JSON.parse(storedData) : null;
  }

  // Debug: Log cart data
  console.log("Cart Data:", cartData);

  // Check if cart is empty
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__content">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <p style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
            Your cart is empty. Please add items to your cart.
          </p>
        </div>
      </div>
    );
  }

  // Extract data from cart response
  const item = cartData?.items?.[0];
  const nickname = item?.productDetail?.nickname || "test67";
  const portingFlag = item?.productDetail?.portInfo?.portingFlag || "N";
  const deviceName = item?.name || "iPhone 15";
  const brand = item?.brand || "Apple";
  const capacity = item?.variants?.[0]?.capacity || "128GB";
  const simType = item?.productDetail?.simType || "eSIM";
  const color = item?.variants?.[0]?.color?.name || "Black";

  // Get service plans
  const servicePlans = item?.productDetail?.servicePlans || [];
  const paymentPlan = servicePlans.find((sp: any) => sp.type === "PaymentPlan");
  const ratePlan = servicePlans.find((sp: any) => sp.type === "RatePlan");
  const insurancePlan = servicePlans.find(
    (sp: any) => sp.type === "InsurancePlan",
  );
  const activationFee = servicePlans.find(
    (sp: any) => sp.type === "ActivationFee",
  );
  const waiveFee = servicePlans.find(
    (sp: any) => sp.type === "WaiveActivationFee",
  );

  // Get selected plan options
  const selectedRatePlan = ratePlan?.options?.find(
    (opt: any) => opt.id === ratePlan.selectedPlanId,
  );

  const selectedInsurancePlan = insurancePlan?.options?.find(
    (opt: any) => opt.id === insurancePlan.selectedPlanId,
  );

  // Get promotions
  const promotions = item?.productDetail?.promotions || [];

  // Calculate prices
  const oneTimeTotal = cartData?.price?.oneTimeTotal || 0;
  const oneTimeTax = cartData?.price?.oneTimeTax || 0;

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <div className="cart-page__top-bar">
          <div className="cart-page__contact">833.600.1562</div>
          <div className="cart-page__top-links">
            <a href="#">Coverage Map</a>
            <a href="#">Find a Store</a>
            <a href="#">My Account</a>
            <a href="#">Español</a>
          </div>
        </div>
        <div className="cart-page__main-header">
          <div className="cart-page__logo">
            <div className="cart-page__logo-text">
              <span className="cart-page__logo-spectrum">Spectrum</span>
              <span className="cart-page__logo-mobile">mobile</span>
            </div>
          </div>
          <nav className="cart-page__nav">
            <div className="cart-page__nav-links">
              <a href="#">Residential</a>
              <a href="#" className="active">
                Mobile
              </a>
              <a href="#">Business</a>
            </div>
            <div className="cart-page__nav-links">
              <a href="#">Plans</a>
              <a href="#">Products</a>
              <a href="#">Bring Your Device</a>
              <a href="#">Contact Us</a>
            </div>
          </nav>
          <div className="cart-page__header-actions">
            <a href="#" className="cart-page__sign-out">
              Sign Out
            </a>
            <div className="cart-page__cart-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <span className="cart-page__cart-badge">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-page__content">
        <div className="cart-page__title-section">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <button className="cart-page__checkout-btn-top">CHECKOUT</button>
        </div>

        <div className="cart-page__container">
          <div className="cart-page__item">
            <div className="cart-page__item-image">
              <img
                src={
                  item?.variants?.[0]?.images?.primary?.url ||
                  "/images/iphone15.png"
                }
                alt={`${brand} ${deviceName}`}
              />
            </div>
            <div className="cart-page__item-details">
              <div className="cart-page__item-row cart-page__item-row--top">
                <input
                  className="cart-page__number-input"
                  value={nickname}
                  readOnly
                />
                <span className="cart-page__number-label">
                  {portingFlag === "Y" ? "Keep Number" : "New Number"}
                </span>
                <div className="cart-page__actions">
                  <span className="cart-page__edit">Edit</span>
                  <span className="cart-page__remove">Remove</span>
                </div>
              </div>
              <div className="cart-page__desc">
                {brand} {deviceName}, {color}, {capacity} with {simType}
              </div>
              <div className="cart-page__item-pricing">
                {paymentPlan && (
                  <div className="cart-page__pricing-row">
                    <span>
                      Device Payment, $
                      {paymentPlan.price.monthlyRecurringCharge}/mo for{" "}
                      {paymentPlan.options?.[0]?.term || 36} months, 0% APR
                    </span>
                    <span className="cart-page__price">
                      ${paymentPlan.price.monthlyRecurringCharge}
                    </span>
                  </div>
                )}
                {selectedRatePlan && (
                  <div className="cart-page__pricing-row">
                    <span>
                      {selectedRatePlan.name} $
                      {ratePlan.price.monthlyRecurringCharge}/line
                    </span>
                    <span className="cart-page__price">
                      ${ratePlan.price.monthlyRecurringCharge}
                    </span>
                  </div>
                )}
                {promotions
                  .filter((p: any) => p.promoDisplayable)
                  .map((promo: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="cart-page__pricing-row cart-page__discount">
                        <span>
                          🔵 ${Math.abs(promo.price.monthlyRecurringCharge)}/mo
                          discount applied
                        </span>
                        <span></span>
                      </div>
                      {promo.durationOfServicePromotion < 999 && (
                        <div className="cart-page__discount-note">
                          Ends {promo.durationOfServicePromotion} months after
                          activation
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                {selectedInsurancePlan && (
                  <div className="cart-page__pricing-row">
                    <span>
                      {selectedInsurancePlan.name}, $
                      {insurancePlan.price.monthlyRecurringCharge}/mo
                    </span>
                    <span className="cart-page__price">
                      ${insurancePlan.price.monthlyRecurringCharge}
                    </span>
                  </div>
                )}
                {activationFee && (
                  <div className="cart-page__pricing-row">
                    <span>One Time Activation Charge</span>
                    <span className="cart-page__price">
                      ${activationFee.price.oneTimeCharge}
                    </span>
                  </div>
                )}
                {waiveFee && waiveFee.price.oneTimeCharge < 0 && (
                  <div className="cart-page__pricing-row cart-page__discount">
                    <span>
                      🔵 ${Math.abs(waiveFee.price.oneTimeCharge)} discount
                      applied
                    </span>
                    <span></span>
                  </div>
                )}
              </div>
              <div className="cart-page__accessories">
                <a href="#">Featured Accessories ▼</a>
              </div>
            </div>
          </div>

          <div className="cart-page__add-device">
            <span>want to add more lines?</span>
            <button className="cart-page__add-device-btn">ADD A DEVICE</button>
          </div>

          <div className="cart-page__tax-section">
            <div className="cart-page__tax-header">
              <span className="cart-page__tax-label">
                Sales Tax on Equipment ⓘ
              </span>
              <span className="cart-page__tax-value">
                ${oneTimeTax.toFixed(2)} ▼
              </span>
            </div>
            <div className="cart-page__tax-note">
              Taxes are based on the full retail price of your product and must
              be paid in one upfront payment. Sales tax calculated using your
              zip code: 85221 8592.
            </div>
            <a className="cart-page__tax-link" href="#">
              View Included Taxes, Fees and Other Charges
            </a>
          </div>

          <div className="cart-page__total-section">
            <span className="cart-page__total-label">Total</span>
            <span className="cart-page__total-value">
              ${oneTimeTotal.toFixed(2)}
            </span>
          </div>

          <div className="cart-page__actions-bottom">
            <a className="cart-page__monthly-link" href="#">
              View Monthly Costs
            </a>
            <div className="cart-page__bottom-buttons">
              <button className="cart-page__continue-btn">
                CONTINUE SHOPPING
              </button>
              <button className="cart-page__checkout-btn">CHECKOUT</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="cart-page__footer">
        <div className="cart-page__footer-content">
          <div className="cart-page__footer-logo">
            <span className="cart-page__footer-spectrum">Spectrum</span>
            <span className="cart-page__footer-mobile">mobile</span>
          </div>
          <div className="cart-page__footer-links">
            <a href="#">California Privacy Policy</a>
            <span>|</span>
            <a href="#">Do Not Sell or Share My Personal Information</a>
            <span>|</span>
            <a href="#">Terms of Service/Policies</a>
            <span>|</span>
            <a href="#">
              California Consumer Limit the Use of My Sensitive Personal
              Information
            </a>
          </div>
          <div className="cart-page__footer-text">
            Not all products, pricing and services are available in all areas.
            Pricing and actual speeds may vary. Internet speeds based on wired
            connection. Restrictions apply.
          </div>
          <div className="cart-page__footer-copyright">
            ©2026 Charter Communications. All rights reserved.
          </div>
        </div>
        <button className="cart-page__chat-btn">💬 Chat with Us</button>
      </footer>
    </div>
  );
};

export default CartPage;
