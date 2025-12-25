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

// Mock data
export const mockPhonesData: Phone[] = [
  {
    id: "1",
    brand: "Apple",
    model: "iPhone 15 Pro",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
    monthlyPrice: "$41.62",
    originalMonthlyPrice: "$45.83",
    fullPrice: "$999",
    financing: "0% APR for 24 months",
    promotion: "Trade-in offer available",
    colors: [
      "Natural Titanium",
      "Blue Titanium",
      "White Titanium",
      "Black Titanium",
    ],
    is5G: true,
  },
  {
    id: "2",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300",
    monthlyPrice: "$49.99",
    fullPrice: "$1199",
    financing: "0% APR for 24 months",
    colors: [
      "Titanium Black",
      "Titanium Gray",
      "Titanium Violet",
      "Titanium Yellow",
    ],
    is5G: true,
  },
  {
    id: "3",
    brand: "Google",
    model: "Pixel 8 Pro",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300",
    monthlyPrice: "$37.46",
    fullPrice: "$899",
    financing: "0% APR for 24 months",
    promotion: "$200 store credit with purchase",
    colors: ["Obsidian", "Porcelain", "Bay"],
    is5G: true,
  },
  {
    id: "4",
    brand: "Apple",
    model: "iPhone 15",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    monthlyPrice: "$33.29",
    fullPrice: "$799",
    financing: "0% APR for 24 months",
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    is5G: true,
  },
  {
    id: "5",
    brand: "Samsung",
    model: "Galaxy S24",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300",
    monthlyPrice: "$33.33",
    fullPrice: "$800",
    financing: "0% APR for 24 months",
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    is5G: true,
  },
  {
    id: "6",
    brand: "OnePlus",
    model: "12 Pro",
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300",
    monthlyPrice: "$37.46",
    fullPrice: "$899",
    financing: "0% APR for 24 months",
    promotion: "Free earbuds included",
    colors: ["Flowy Emerald", "Silky Black"],
    is5G: true,
  },
  {
    id: "7",
    brand: "Apple",
    model: "iPhone 14 Pro",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=300",
    monthlyPrice: "$37.46",
    originalMonthlyPrice: "$41.62",
    fullPrice: "$899",
    financing: "0% APR for 24 months",
    promotion: "Limited time discount",
    colors: ["Deep Purple", "Space Black", "Silver", "Gold"],
    is5G: true,
  },
  {
    id: "8",
    brand: "Samsung",
    model: "Galaxy Z Fold 5",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=300",
    monthlyPrice: "$74.96",
    fullPrice: "$1799",
    financing: "0% APR for 24 months",
    promotion: "Trade-in up to $1000 off",
    colors: ["Icy Blue", "Phantom Black", "Cream"],
    is5G: true,
  },
];

// Mock service class
export class PhoneMockService {
  // Simulate network delay
  private static async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get all phones from mock data
  static async getPhones(): Promise<Phone[]> {
    try {
      await this.simulateDelay(500);
      console.log("📱 Returning mock phones data");
      return [...mockPhonesData];
    } catch (error) {
      console.error("Error fetching mock phones:", error);
      throw error;
    }
  }

  // Get phone by ID from mock data
  static async getPhoneById(id: string): Promise<Phone | null> {
    try {
      await this.simulateDelay(300);
      const phone = mockPhonesData.find((phone) => phone.id === id);
      console.log(`📱 Returning mock phone data for ID: ${id}`);
      return phone || null;
    } catch (error) {
      console.error("Error fetching mock phone by ID:", error);
      throw error;
    }
  }

  // Get phones by brand from mock data
  static async getPhonesByBrand(brand: string): Promise<Phone[]> {
    try {
      await this.simulateDelay(400);
      const phonesByBrand = mockPhonesData.filter(
        (phone) => phone.brand.toLowerCase() === brand.toLowerCase()
      );
      console.log(`📱 Returning mock phones data for brand: ${brand}`);
      return phonesByBrand;
    } catch (error) {
      console.error("Error fetching mock phones by brand:", error);
      throw error;
    }
  }

  // Get available brands from mock data
  static async getAvailableBrands(): Promise<string[]> {
    try {
      await this.simulateDelay(200);
      const brands = Array.from(
        new Set(mockPhonesData.map((phone) => phone.brand))
      );
      console.log("📱 Returning mock available brands");
      return brands;
    } catch (error) {
      console.error("Error fetching mock available brands:", error);
      throw error;
    }
  }

  // Get phones with promotions
  static async getPhonesWithPromotions(): Promise<Phone[]> {
    try {
      await this.simulateDelay(400);
      const promotionalPhones = mockPhonesData.filter(
        (phone) => phone.promotion
      );
      console.log("📱 Returning mock promotional phones");
      return promotionalPhones;
    } catch (error) {
      console.error("Error fetching mock promotional phones:", error);
      throw error;
    }
  }

  // Get phones by price range
  static async getPhonesByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Phone[]> {
    try {
      await this.simulateDelay(350);
      const filteredPhones = mockPhonesData.filter((phone) => {
        const price = parseInt(phone.fullPrice.replace(/[\$,]/g, ""));
        return price >= minPrice && price <= maxPrice;
      });
      console.log(
        `📱 Returning mock phones in price range: $${minPrice} - $${maxPrice}`
      );
      return filteredPhones;
    } catch (error) {
      console.error("Error fetching mock phones by price range:", error);
      throw error;
    }
  }

  // Search phones by model name
  static async searchPhones(searchTerm: string): Promise<Phone[]> {
    try {
      await this.simulateDelay(300);
      const searchResults = mockPhonesData.filter(
        (phone) =>
          phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phone.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`📱 Returning mock search results for: ${searchTerm}`);
      return searchResults;
    } catch (error) {
      console.error("Error searching mock phones:", error);
      throw error;
    }
  }
}

export default PhoneMockService;
