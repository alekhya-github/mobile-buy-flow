// Phone data types
export interface Phone {
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

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Configuration
const API_BASE_URL = "http://localhost:3001/api";

// Service functions
export class PhoneService {
  // Get all phones from backend API
  static async getPhones(): Promise<Phone[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/phones`);
      const result: ApiResponse<Phone[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching phones:", error);
      throw error;
    }
  }

  // Get phone by ID from backend API
  static async getPhoneById(id: string): Promise<Phone | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/${id}`);
      const result: ApiResponse<Phone> = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Phone not found
        }
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch phone");
      }

      return result.data || null;
    } catch (error) {
      console.error("Error fetching phone by ID:", error);
      throw error;
    }
  }

  // Get phones by brand from backend API
  static async getPhonesByBrand(brand: string): Promise<Phone[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/phones/brand/${encodeURIComponent(brand)}`
      );
      const result: ApiResponse<Phone[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching phones by brand:", error);
      throw error;
    }
  }

  // Get available brands from backend API
  static async getAvailableBrands(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/brands`);
      const result: ApiResponse<string[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching available brands:", error);
      throw error;
    }
  }
}

export default PhoneService;
