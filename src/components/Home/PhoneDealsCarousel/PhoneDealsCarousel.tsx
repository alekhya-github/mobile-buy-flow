import React, { useState } from "react";
import "./PhoneDealsCarousel.scss";

interface PhoneDeal {
  id: number;
  name: string;
  dealText: string;
  image?: string;
}

const PhoneDealsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const deals: PhoneDeal[] = [
    { id: 1, name: "iPhone 15", dealText: "Get $400 Off" },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      dealText: "Kick Off the New Year with Big Savings",
    },
    { id: 3, name: "Google Pixel 8", dealText: "Get $300 Off" },
    { id: 4, name: "iPhone 14", dealText: "Special Offer" },
  ];

  const itemsPerView = 2;
  const maxIndex = Math.max(0, deals.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="phone-deals-carousel">
      <div className="phone-deals-carousel__container">
        <h2 className="phone-deals-carousel__title">
          Spectrum Deals on Smartphones
        </h2>

        <div className="carousel">
          <button
            className="carousel__button carousel__button--prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="carousel__viewport">
            <div
              className="carousel__track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {deals.map((deal) => (
                <div key={deal.id} className="carousel__slide">
                  <div className="deal-card">
                    <div className="deal-card__image">
                      {/* Placeholder for phone image */}
                      <span className="deal-card__placeholder">📱</span>
                    </div>
                    <div className="deal-card__content">
                      <h3 className="deal-card__name">{deal.name}</h3>
                      <p className="deal-card__deal">{deal.dealText}</p>
                      <button className="deal-card__cta">Learn More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel__button carousel__button--next"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className="carousel__indicators">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`carousel__dot ${
                index === currentIndex ? "carousel__dot--active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhoneDealsCarousel;
