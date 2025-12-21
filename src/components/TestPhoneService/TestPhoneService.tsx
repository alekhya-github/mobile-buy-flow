import React, { useState } from "react";
import PhoneService from "../../services/phoneService";
import PhoneServiceAxios from "../../services/phoneServiceAxios";
import "./TestPhoneService.scss";

interface Phone {
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
  is5G?: boolean;
}

const TestPhoneService: React.FC = () => {
  const [fetchPhones, setFetchPhones] = useState<Phone[]>([]);
  const [axiosPhones, setAxiosPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState<{ fetch: boolean; axios: boolean }>({
    fetch: false,
    axios: false,
  });
  const [errors, setErrors] = useState<{ fetch: string; axios: string }>({
    fetch: "",
    axios: "",
  });

  const testFetchPhones = async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setErrors((prev) => ({ ...prev, fetch: "" }));

    try {
      const phones = await PhoneService.getPhones();
      setFetchPhones(phones);
      console.log("Fetch Phones:", phones);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setErrors((prev) => ({ ...prev, fetch: errorMessage }));
      console.error("Fetch error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const testAxiosPhones = async () => {
    setLoading((prev) => ({ ...prev, axios: true }));
    setErrors((prev) => ({ ...prev, axios: "" }));

    try {
      const phones = await PhoneServiceAxios.getPhones();
      setAxiosPhones(phones);
      console.log("Axios Phones:", phones);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setErrors((prev) => ({ ...prev, axios: errorMessage }));
      console.error("Axios error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, axios: false }));
    }
  };

  const clearResults = () => {
    setFetchPhones([]);
    setAxiosPhones([]);
    setErrors({ fetch: "", axios: "" });
  };

  return (
    <div className="test-phone-service">
      <h2>Phone Service Testing</h2>

      <div className="test-controls">
        <button
          onClick={testFetchPhones}
          disabled={loading.fetch}
          className="test-button fetch-button"
        >
          {loading.fetch ? "Testing Fetch..." : "Test Fetch getPhones()"}
        </button>

        <button
          onClick={testAxiosPhones}
          disabled={loading.axios}
          className="test-button axios-button"
        >
          {loading.axios ? "Testing Axios..." : "Test Axios getPhones()"}
        </button>

        <button onClick={clearResults} className="test-button clear-button">
          Clear Results
        </button>
      </div>

      {(errors.fetch || errors.axios) && (
        <div className="errors-section">
          {errors.fetch && (
            <div className="error fetch-error">
              <strong>Fetch Error:</strong> {errors.fetch}
            </div>
          )}
          {errors.axios && (
            <div className="error axios-error">
              <strong>Axios Error:</strong> {errors.axios}
            </div>
          )}
        </div>
      )}

      <div className="results-section">
        <div className="result-column">
          <h3>Fetch Results ({fetchPhones.length} phones)</h3>
          <div className="phone-list">
            {fetchPhones.map((phone) => (
              <div key={phone.id} className="phone-card">
                <h4>
                  {phone.brand} {phone.model}
                </h4>
                <p>Price: {phone.monthlyPrice}</p>
                <p>5G: {phone.is5G ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="result-column">
          <h3>Axios Results ({axiosPhones.length} phones)</h3>
          <div className="phone-list">
            {axiosPhones.map((phone) => (
              <div key={phone.id} className="phone-card">
                <h4>
                  {phone.brand} {phone.model}
                </h4>
                <p>Price: {phone.monthlyPrice}</p>
                <p>5G: {phone.is5G ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPhoneService;
