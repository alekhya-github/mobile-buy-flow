// ============================================
// Phone List Item - Simplified for listing page
// ============================================
export interface PhoneListItem {
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

// ============================================
// Full Phone Types - Matching Backend API
// ============================================
export interface StorageOption {
  capacity: string;
  price: string;
  monthlyPrice: string;
}

export interface ColorOption {
  name: string;
  hexCode: string;
  image: string;
}

export interface TradeInOption {
  condition: string;
  savings: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Accessory {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
}

export interface Phone {
  id: string;
  brand: string;
  model: string;
  tagline?: string;
  images: {
    main: string;
    gallery: string[];
  };
  colors: ColorOption[];
  selectedColor?: string;
  storageOptions: StorageOption[];
  selectedStorage?: string;
  pricing: {
    fullPrice: string;
    monthlyPrice: string;
    originalMonthlyPrice?: string;
    financingText: string;
    promoText?: string;
  };
  availability: {
    status: "In Stock" | "Out of Stock" | "Backorder" | "Pre-order";
    estimatedShipDate?: string;
  };
  purchaseOptions: {
    addNewLine: boolean;
    upgradeExistingLine: boolean;
    tradeInAvailable: boolean;
    tradeInOptions?: TradeInOption[];
  };
  features: {
    keyFeatures: Feature[];
    specs: {
      chip?: string;
      display?: string;
      camera?: string;
      battery?: string;
      connectivity?: string;
      dimensions?: string;
      weight?: string;
      network?: string;
      sensors?: string;
      security?: string;
      accessibility?: string;
    };
  };
  accessories: Accessory[];
  badges?: string[];
  is5G: boolean;
  freeShipping: boolean;
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

// ============================================
// Transform function - Convert API Phone to PhoneListItem
// ============================================
function transformPhoneToListItem(phone: Phone): PhoneListItem {
  return {
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    image: phone.images.main,
    monthlyPrice: `$${phone.pricing.monthlyPrice}/mo`,
    originalMonthlyPrice: phone.pricing.originalMonthlyPrice
      ? `$${phone.pricing.originalMonthlyPrice}/mo`
      : undefined,
    fullPrice: phone.pricing.fullPrice,
    financing: phone.pricing.financingText,
    promotion: phone.pricing.promoText,
    colors: phone.colors.map((c) => c.hexCode),
    is5G: phone.is5G,
  };
}

// Service functions
export class PhoneService {
  // Get all phones from backend API (transformed for listing)
  static async getPhones(): Promise<PhoneListItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/phones`);
      const result: ApiResponse<Phone[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      // Transform to list items for listing page
      return (result.data || []).map(transformPhoneToListItem);
    } catch (error) {
      console.error("Error fetching phones:", error);
      throw error;
    }
  }

  // Get full phone details from backend API
  static async getPhoneDetails(id: string): Promise<Phone | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/${id}`);
      const result: ApiResponse<Phone> = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return null;
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
      console.error("Error fetching phone details:", error);
      throw error;
    }
  }

  // Get phone by ID from backend API (transformed for listing)
  static async getPhoneById(id: string): Promise<PhoneListItem | null> {
    const phone = await this.getPhoneDetails(id);
    return phone ? transformPhoneToListItem(phone) : null;
  }

  // Get phones by brand from backend API
  static async getPhonesByBrand(brand: string): Promise<PhoneListItem[]> {
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

      return (result.data || []).map(transformPhoneToListItem);
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
