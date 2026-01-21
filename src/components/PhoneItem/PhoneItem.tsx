import React from "react";
import { Link } from "react-router-dom";
import "./PhoneItem.scss";

interface PhoneItemProps {
  id: string;
  brand: string;
  model: string;
  image: string;
  monthlyPrice: string;
  originalMonthlyPrice?: string;
  fullPrice: string;
  financing: string;
  promotion?: string;
  colors: string[];
  selectedColor?: string;
  is5G?: boolean;
  onColorSelect?: (color: string) => void;
}

const PhoneItem: React.FC<PhoneItemProps> = ({
  id,
  brand,
  model,
  image,
  monthlyPrice,
  originalMonthlyPrice,
  fullPrice,
  financing,
  promotion,
  colors,
  selectedColor,
  is5G = false,
  onColorSelect,
}) => {
  return (
    <div className="phone-item">
      {is5G && <div className="phone-item__badge">5G Device</div>}

      {/* Clickable link to phone details */}
      <Link to={`/mobile/phone/${id}`} className="phone-item__link">
        <div className="phone-item__image-container">
          <img
            src={image}
            alt={`${brand} ${model}`}
            className="phone-item__image"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = `
                <div class="phone-item__image-placeholder">
                  📱
                  <span class="phone-item__image-text">${brand} ${model}</span>
                </div>
              `;
            }}
          />
        </div>
      </Link>

      <div className="phone-item__colors">
        {colors.map((color, index) => (
          <button
            key={index}
            className={`phone-item__color ${
              selectedColor === color ? "active" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect?.(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>

      <div className="phone-item__details">
        <div className="phone-item__brand">{brand}</div>
        <Link to={`/mobile/phone/${id}`} className="phone-item__model-link">
          <h3 className="phone-item__model">{model}</h3>
        </Link>

        <div className="phone-item__pricing">
          <div className="phone-item__monthly">
            Starting at{" "}
            <span className="phone-item__price">{monthlyPrice}</span>
            {originalMonthlyPrice && (
              <span className="phone-item__original-price">
                {originalMonthlyPrice}
              </span>
            )}
          </div>
          <div className="phone-item__financing">{financing}</div>
          <div className="phone-item__full-price">Full price: {fullPrice}</div>
        </div>

        {promotion && (
          <div className="phone-item__promotion">
            <span className="phone-item__promotion-icon">💡</span>
            {promotion}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneItem;
