import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PhoneService, { Phone } from "../../services/phoneService";
import TradeInSection, { TradeInOffer } from "../TradeInSection/TradeInSection";
import TradeInModal from "../TradeInSection/TradeInModal";
import "./PhoneDetails.scss";
// Import the context hook to save selections
import { useMobileBuyFlow } from "../../context/PhoneSelectionContext";

// Helper function to get full image URL (uses local public folder)
const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  // If already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // For local images, return the path as-is (React will resolve from public folder)
  return imagePath;
};

const PhoneDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get the context functions to save phone selections
  const { updatePhoneDetails, updateTradeInDetails } = useMobileBuyFlow();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState<boolean>(false);
  const [acceptedTradeInOffer, setAcceptedTradeInOffer] =
    useState<TradeInOffer | null>(null);

  // Fetch phone details when component mounts or id changes
  useEffect(() => {
    const fetchPhoneDetails = async () => {
      if (!id) {
        setLoading(false);
        setError("Phone not found");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const phoneData = await PhoneService.getPhoneDetails(id);
        if (!phoneData) {
          setError("Phone not found");
        } else {
          setPhone(phoneData);
          // Set default selections
          setSelectedColor(
            phoneData.selectedColor || phoneData.colors[0]?.name || "",
          );
          setSelectedStorage(
            phoneData.selectedStorage ||
              phoneData.storageOptions[0]?.capacity ||
              "",
          );
        }
      } catch (err) {
        setError("Failed to load phone details. Please try again.");
        console.error("Error fetching phone details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneDetails();
  }, [id]);

  // Get the image for the selected color
  const getSelectedColorImage = (): string => {
    if (!phone) return "";
    const colorOption = phone.colors.find((c) => c.name === selectedColor);
    const imagePath = colorOption?.image || phone.images.main;
    return getImageUrl(imagePath);
  };

  // Get the selected storage option
  const getSelectedStorageOption = () => {
    if (!phone) return null;
    return phone.storageOptions.find((s) => s.capacity === selectedStorage);
  };

  // Loading state
  if (loading) {
    return (
      <div className="phone-details">
        <div className="phone-details__loading">
          <div className="phone-details__spinner"></div>
          <p>Loading phone details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !phone) {
    return (
      <div className="phone-details">
        <div className="phone-details__error">
          <p>{error || "Phone not found"}</p>
          <Link to="/mobile/phones" className="phone-details__back-link">
            ← Back to Phones
          </Link>
        </div>
      </div>
    );
  }

  const selectedStorageOption = getSelectedStorageOption();

  // Handle Next button click - Save selections to context and navigate
  const handleNext = () => {
    if (!phone) return;

    // Get the selected color details (name and hex code)
    const selectedColorOption = phone.colors.find(
      (c) => c.name === selectedColor,
    );

    // Step 1: Save phone details to context (shopping cart)
    updatePhoneDetails({
      phoneId: id || null,
      phoneBrand: phone.brand,
      phoneModel: phone.model,
      phoneImage: getSelectedColorImage(),
      selectedColor: selectedColor,
      selectedColorHex: selectedColorOption?.hexCode || null,
      selectedStorage: selectedStorage,
      fullPrice: selectedStorageOption?.price || phone.pricing.fullPrice,
      monthlyPrice:
        selectedStorageOption?.monthlyPrice || phone.pricing.monthlyPrice,
    });

    // Step 2: Save trade-in details if available
    if (acceptedTradeInOffer) {
      updateTradeInDetails({
        hasTradeIn: true,
        tradeInDevice: `${acceptedTradeInOffer.tradeinPhoneBrand} ${acceptedTradeInOffer.tradeinModel}`,
        tradeInValue: acceptedTradeInOffer.tradeinValue || null,
        tradeInCondition: null,
      });
    }

    // Step 3: Navigate to next page
    // Note: We're still passing state for backward compatibility
    navigate("/mobile/customer-check", {
      state: {
        phoneId: id,
        phoneBrand: phone?.brand,
        phoneModel: phone?.model,
        selectedColor,
        selectedStorage,
        tradeInOffer: acceptedTradeInOffer,
      },
    });
  };

  // Main UI
  return (
    <div className="phone-details">
      {/* Back navigation */}
      <Link to="/mobile/phones" className="phone-details__back-link">
        ← Back to Phones
      </Link>

      <div className="phone-details__content">
        {/* Left side - Image Gallery */}
        <div className="phone-details__gallery">
          <div className="phone-details__main-image">
            <img
              src={getSelectedColorImage()}
              alt={`${phone.brand} ${phone.model} - ${selectedColor}`}
              className="phone-details__image"
            />
          </div>
          <div className="phone-details__thumbnails">
            {phone.images.gallery.map((img, index) => (
              <div key={index} className="phone-details__thumbnail">
                <img
                  src={getImageUrl(img)}
                  alt={`${phone.brand} ${phone.model} view ${index + 1}`}
                  className="phone-details__thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Details */}
        <div className="phone-details__info">
          <h1 className="phone-details__title">
            {phone.brand} {phone.model}
          </h1>

          {/* 5G Badge */}
          {phone.is5G && (
            <span className="phone-details__badge">5G Device</span>
          )}

          {/* Today's Purchase Options */}
          <div className="phone-details__purchase-options">
            <h3>TODAY'S PURCHASE</h3>
            <div className="phone-details__purchase-buttons">
              <button className="phone-details__purchase-btn active">
                Add a new line
              </button>
              <button className="phone-details__purchase-btn">
                Upgrade existing line
              </button>
            </div>
            {phone.pricing.promoText && (
              <div className="phone-details__promo">
                {phone.pricing.promoText}
              </div>
            )}
          </div>

          {/* Color Selection */}
          <div className="phone-details__colors">
            <h3>COLOR: {selectedColor.toUpperCase()}</h3>
            <div className="phone-details__color-options">
              {phone.colors.map((color) => (
                <button
                  key={color.name}
                  className={`phone-details__color-btn ${
                    selectedColor === color.name ? "active" : ""
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select ${color.name}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Storage Selection */}
          <div className="phone-details__storage">
            <h3>STORAGE</h3>
            <div className="phone-details__storage-options">
              {phone.storageOptions.map((storage) => (
                <button
                  key={storage.capacity}
                  className={`phone-details__storage-btn ${
                    selectedStorage === storage.capacity ? "active" : ""
                  }`}
                  onClick={() => setSelectedStorage(storage.capacity)}
                >
                  <span className="phone-details__storage-capacity">
                    {storage.capacity}
                  </span>
                  <span className="phone-details__storage-price">
                    {storage.monthlyPrice}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="phone-details__availability">
            <h3>AVAILABILITY</h3>
            <p
              className={`phone-details__status phone-details__status--${phone.availability.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {phone.availability.status}
            </p>
            {phone.availability.estimatedShipDate && (
              <p className="phone-details__ship-date">
                Estimated ship date: {phone.availability.estimatedShipDate}
              </p>
            )}
          </div>

          {/* Trade-In Section */}
          <TradeInSection
            phoneInfo={{
              phoneId: id,
              phoneBrand: phone.brand,
              phoneModel: phone.model,
            }}
            acceptedOffer={acceptedTradeInOffer}
            onTradeInSelect={(hasTradeIn) => {
              if (hasTradeIn) {
                setIsTradeInModalOpen(true);
              }
            }}
            onRemove={() => setAcceptedTradeInOffer(null)}
          />

          {/* Pricing */}
          <div className="phone-details__pricing">
            <div className="phone-details__monthly-price">
              <span className="phone-details__price-label">
                ESTIMATED MONTHLY DEVICE PAYMENT
              </span>
              <div className="phone-details__price-row">
                {phone.pricing.originalMonthlyPrice && (
                  <span className="phone-details__original-price">
                    ${phone.pricing.originalMonthlyPrice}
                  </span>
                )}
                <span className="phone-details__current-price">
                  $
                  {selectedStorageOption?.monthlyPrice ||
                    phone.pricing.monthlyPrice}
                </span>
              </div>
              <p className="phone-details__financing">
                {phone.pricing.financingText}
              </p>
            </div>
            <div className="phone-details__full-price">
              Full price:{" "}
              {selectedStorageOption?.price || phone.pricing.fullPrice}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="phone-details__add-btn" onClick={handleNext}>
            Next
          </button>

          {/* Free Shipping */}
          {phone.freeShipping && (
            <div className="phone-details__shipping">
              ✓ FREE SHIPPING ON ALL ORDERS
            </div>
          )}
        </div>
      </div>

      {/* Trade-In Modal */}
      <TradeInModal
        isOpen={isTradeInModalOpen}
        phoneInfo={{
          phoneId: id,
          phoneBrand: phone.brand,
          phoneModel: phone.model,
        }}
        onClose={() => setIsTradeInModalOpen(false)}
        onAccept={(offer) => {
          setAcceptedTradeInOffer({
            tradeinValue: offer.tradeinValue,
            tradeinPromotion: offer.tradeinPromotion,
            tradeinPhoneBrand: offer.tradeinPhoneBrand,
            tradeinModel: offer.tradeinModel,
          });
        }}
      />
    </div>
  );
};

export default PhoneDetails;
