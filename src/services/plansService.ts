const API_BASE_URL = "http://localhost:3001";

export const fetchPlans = async () => {
  const response = await fetch(`${API_BASE_URL}/plans`);
  if (!response.ok) {
    throw new Error("Failed to fetch plans data");
  }
  return response.json();
};
