import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlansPage.scss";
import { fetchPlans } from "../../services/plansService";
import { addToCart, CartPayload } from "../../services/cartService";
import { useMobileBuyFlow } from "../../context/PhoneSelectionContext";

const PlansPage: React.FC = () => {
  const {
    state: buyFlowState,
    updatePlanDetails,
    updatePortInDetails,
    updateInsurancePlanDetails,
  } = useMobileBuyFlow();
  const { phoneDetails, tradeInDetails } = buyFlowState;
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const navigate = useNavigate();
  const [selectedProtection, setSelectedProtection] = useState<string>("none");
  const [phoneNumberOption, setPhoneNumberOption] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [mobileNumberError, setMobileNumberError] = useState<string>("");
  const [deviceFor, setDeviceFor] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [insurancePlans, setInsurancePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    const getPlans = async () => {
      try {
        setLoading(true);
        const data = await fetchPlans();
        // Only use RatePlan options for data plan cards
        const ratePlanType = data.find(
          (planType: any) => planType.type === "RatePlan",
        );
        const ratePlanOptions =
          ratePlanType?.options?.map((opt: any) => ({
            ...opt,
            type: ratePlanType.type,
          })) || [];
        setPlans(ratePlanOptions);
        setSelectedPlan(ratePlanOptions[0]?.id || "");

        // InsurancePlan options for protection section
        const insuranceType = data.find(
          (planType: any) => planType.type === "InsurancePlan",
        );
        const insuranceOptions =
          insuranceType?.options?.map((opt: any) => ({
            ...opt,
            type: insuranceType.type,
          })) || [];
        setInsurancePlans(insuranceOptions);
      } catch (err) {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    getPlans();
  }, []);

  const handleAddToCart = async () => {
    // Validate required fields
    if (!selectedPlan) {
      setError("Please select a data plan");
      return;
    }

    if (!phoneNumberOption) {
      setError("Please choose a phone number option");
      return;
    }

    if (phoneNumberOption === "keep" && (!mobileNumber || mobileNumberError)) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (!deviceFor.trim()) {
      setError("Please enter who this device is for");
      return;
    }

    setError("");
    setAddingToCart(true);

    try {
      // Build service plans array
      const servicePlans = [
        { planType: "RatePlan", selectedPlanId: selectedPlan },
        { planType: "PaymentPlan", selectedPlanId: "RECURRING" },
        { planType: "ActivationFee", selectedPlanId: "ActivationFee" },
        {
          planType: "WaiveActivationFee",
          selectedPlanId: "WaiveActivationFee",
        },
      ];

      // Add insurance plan if selected
      if (selectedProtection && selectedProtection !== "none") {
        servicePlans.push({
          planType: "InsurancePlan",
          selectedPlanId: selectedProtection,
        });
      }

      // Save plan selections to context before API call
      const selectedPlanObj = plans.find((p) => p.id === selectedPlan);
      if (selectedPlanObj) {
        updatePlanDetails({
          planId: selectedPlanObj.id,
          planName: selectedPlanObj.name,
          planPrice: String(
            selectedPlanObj.price?.monthlyCharge ||
              selectedPlanObj.price?.monthlyRecurringCharge ||
              0,
          ),
          dataAllowance: selectedPlanObj.description || "",
        });
      }

      updatePortInDetails({
        isPortingNumber: phoneNumberOption === "keep",
        currentCarrier: "",
        phoneNumber: phoneNumberOption === "keep" ? mobileNumber : "",
        accountNumber: "",
      });

      if (selectedProtection && selectedProtection !== "none") {
        const selectedInsuranceObj = insurancePlans.find(
          (p) => p.id === selectedProtection,
        );
        if (selectedInsuranceObj) {
          updateInsurancePlanDetails({
            hasInsurance: true,
            insurancePlanId: selectedInsuranceObj.id,
            insurancePlanName: selectedInsuranceObj.name,
            insurancePrice: String(
              selectedInsuranceObj.price?.monthlyCharge ||
                selectedInsuranceObj.price?.monthlyRecurringCharge ||
                0,
            ),
          });
        }
      } else {
        updateInsurancePlanDetails({
          hasInsurance: false,
          insurancePlanId: "",
          insurancePlanName: "",
          insurancePrice: "0",
        });
      }

      // Build cart payload
      const payload: CartPayload = {
        fulfillmentMethod: "SHIP_TO_HOME",
        items: [
          {
            itemType: "DEVICE",
            type: "SALES",
            sku: "195949035005", // iPhone 15 SKU (hardcoded for now)
            productDetail: {
              nickname: deviceFor || "test778",
              portInfo: {
                portingFlag: phoneNumberOption === "keep" ? "Y" : "N",
              },
              servicePlans: servicePlans,
            },
            simType: "eSIM",
          },
        ],
      };

      // Call API to add to cart
      const cartResponse = await addToCart(payload);

      console.log("✅ Cart API Response:", cartResponse);

      // Store cart data in localStorage
      localStorage.setItem("cartData", JSON.stringify(cartResponse));
      console.log("✅ Cart data saved to localStorage");

      // Navigate to cart page with response data
      navigate("/cart", { state: { cartData: cartResponse } });
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="plans-page">
      <h1 className="plans-page__title">Customize Your Plan</h1>
      <div className="plans-page__main">
        <div className="plans-page__phone-summary">
          <h3 className="plans-page__summary-title">Your Selection</h3>
          <div className="plans-page__phone-image">
            <img
              src={phoneDetails.phoneImage || ""}
              alt={`${phoneDetails.phoneBrand} ${phoneDetails.phoneModel}`}
            />
          </div>
          <div className="plans-page__phone-info">
            <div className="plans-page__phone-brand">
              {phoneDetails.phoneBrand}
            </div>
            <div className="plans-page__phone-model">
              {phoneDetails.phoneModel}
            </div>

            <div className="plans-page__detail-row">
              <span className="plans-page__detail-label">Color:</span>
              <span className="plans-page__detail-value">
                {phoneDetails.selectedColor}
              </span>
            </div>
            <div className="plans-page__detail-row">
              <span className="plans-page__detail-label">Storage:</span>
              <span className="plans-page__detail-value">
                {phoneDetails.selectedStorage}
              </span>
            </div>
            <div className="plans-page__detail-row">
              <span className="plans-page__detail-label">Full Price:</span>
              <span className="plans-page__detail-value">
                ${phoneDetails.fullPrice}
              </span>
            </div>
            <div className="plans-page__detail-row">
              <span className="plans-page__detail-label">Monthly:</span>
              <span className="plans-page__detail-value">
                ${phoneDetails.monthlyPrice}/mo
              </span>
            </div>

            {tradeInDetails.hasTradeIn && (
              <div className="plans-page__trade-in">
                <div className="plans-page__trade-in-label">
                  Trade-In Applied
                </div>
                <div className="plans-page__trade-in-device">
                  {tradeInDetails.tradeInDevice}
                </div>
                <div className="plans-page__trade-in-value">
                  -${tradeInDetails.tradeInValue} credit
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="plans-page__content">
          <section className="plans-page__section">
            <h2>Choose Your Data Plan</h2>
            <div className="plans-page__plans">
              {loading && <div>Loading plans...</div>}
              {error && <div style={{ color: "red" }}>{error}</div>}
              {!loading &&
                !error &&
                plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`plan-card${selectedPlan === plan.id ? " selected" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="plan-card__name">{plan.name}</div>
                    <div className="plan-card__price">
                      {plan.price?.monthlyCharge
                        ? `$${plan.price.monthlyCharge}/mo`
                        : `$${plan.price?.monthlyRecurringCharge || 0}/mo`}
                    </div>
                    <div className="plan-card__desc">{plan.description}</div>
                    <div className="plan-card__label">{plan.type}</div>
                    {plan.name === "Unlimited Plus" && (
                      <div className="plan-card__upgrade">Anytime Upgrade</div>
                    )}
                  </label>
                ))}
            </div>
          </section>

          <section className="plans-page__section">
            <h2>Choose Your Phone Number</h2>
            <div className="plans-page__phone-number">
              <div>
                <button
                  className={phoneNumberOption === "keep" ? "selected" : ""}
                  onClick={() => setPhoneNumberOption("keep")}
                >
                  Keep my phone number
                </button>
                {phoneNumberOption === "keep" && (
                  <div
                    className="plans-page__mobile-number"
                    style={{ marginTop: 8 }}
                  >
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMobileNumber(value);
                        // Simple validation: 10 digits, numbers only
                        if (!/^\d{10}$/.test(value)) {
                          setMobileNumberError(
                            "Please enter a valid 10-digit mobile number.",
                          );
                        } else {
                          setMobileNumberError("");
                        }
                      }}
                      placeholder="Enter your mobile number"
                      maxLength={10}
                    />
                    {mobileNumberError && (
                      <div style={{ color: "red", marginTop: 4 }}>
                        {mobileNumberError}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className={phoneNumberOption === "new" ? "selected" : ""}
                onClick={() => setPhoneNumberOption("new")}
              >
                I want a new number
              </button>
            </div>
          </section>

          <section className="plans-page__section">
            <h2>Would You Like To Add Protection To Your New Device?</h2>
            <div className="plans-page__protection">
              {insurancePlans.map((plan) => (
                <button
                  key={plan.id}
                  className={selectedProtection === plan.id ? "selected" : ""}
                  onClick={() => setSelectedProtection(plan.id)}
                >
                  {plan.name}{" "}
                  {plan.price?.monthlyCharge
                    ? `$${plan.price.monthlyCharge}/mo`
                    : `$${plan.price?.monthlyRecurringCharge || 0}/mo`}
                </button>
              ))}
              <button
                className={selectedProtection === "none" ? "selected" : ""}
                onClick={() => setSelectedProtection("none")}
              >
                No, I don't want to protect my device
              </button>
            </div>
          </section>

          <section className="plans-page__section">
            <h2>Who is this device for?</h2>
            <input
              type="text"
              value={deviceFor}
              onChange={(e) => setDeviceFor(e.target.value)}
              placeholder="Enter name"
            />
          </section>

          <div className="plans-page__summary">
            <div className="plans-page__price">$17.49/mo</div>
            <div className="plans-page__tax">Taxes & other charges apply.</div>
            {error && (
              <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
            )}
            <button
              className="plans-page__add-to-cart"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
