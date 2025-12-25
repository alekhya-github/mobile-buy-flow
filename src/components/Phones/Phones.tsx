import React, { useState, useEffect } from "react";
import PhoneItem from "../PhoneItem/PhoneItem";
import PhoneMockService, { Phone } from "../../services/phoneMockService";
import "./Phones.scss";

const Phones: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<{
    [key: string]: string;
  }>({});
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleColorSelect = (phoneId: string, color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [phoneId]: color,
    }));
  };

  // Fetch phones from service
  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true);
        setError(null);
        const phoneData = await PhoneMockService.getPhones();
        setPhones(phoneData);
      } catch (err) {
        setError("Failed to load phones. Please try again.");
        console.error("Error fetching phones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  if (loading) {
    return (
      <div className="phones">
        <div className="phones__loading">
          <div className="phones__spinner"></div>
          <p>Loading phones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="phones">
        <div className="phones__error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="phones__retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phones">
      <div className="phones__header">
        <h2>Latest Smartphones</h2>
        <p>
          Browse our collection of the newest phones with cutting-edge
          technology!
        </p>
      </div>

      <div className="phones__grid">
        {phones.map((phone) => (
          <PhoneItem
            key={phone.id}
            {...phone}
            selectedColor={selectedColors[phone.id] || phone.colors[0]}
            onColorSelect={(color) => handleColorSelect(phone.id, color)}
          />
        ))}
      </div>
    </div>
  );
};

export default Phones;
