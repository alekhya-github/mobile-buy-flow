import axios from "axios";

// Phone data types (same as original)
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

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service functions using Axios
export class PhoneServiceAxios {
  // Get all phones from backend API using Axios
  static async getPhones(): Promise<Phone[]> {
    try {
      const response = await apiClient.get<ApiResponse<Phone[]>>("/phones");
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch phones");
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching phones with axios:", error);
      throw error;
    }
  }

  // Get phone by ID from backend API using Axios
  static async getPhoneById(id: string): Promise<Phone | null> {
    try {
      const response = await apiClient.get<ApiResponse<Phone>>(`/phones/${id}`);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch phone");
      }

      return result.data || null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Phone not found
      }
      console.error("Error fetching phone by ID with axios:", error);
      throw error;
    }
  }

  // Get phones by brand from backend API using Axios
  static async getPhonesByBrand(brand: string): Promise<Phone[]> {
    try {
      const response = await apiClient.get<ApiResponse<Phone[]>>(
        `/phones/brand/${encodeURIComponent(brand)}`
      );
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch phones by brand");
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching phones by brand with axios:", error);
      throw error;
    }
  }

  // Get available brands from backend API using Axios
  static async getAvailableBrands(): Promise<string[]> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        "/phones/brands"
      );
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch available brands");
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching available brands with axios:", error);
      throw error;
    }
  }
}

export default PhoneServiceAxios;
