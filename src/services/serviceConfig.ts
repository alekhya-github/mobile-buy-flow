// Service Configuration
export const ServiceConfig = {
  // Toggle between mock data and real API
  USE_MOCK_DATA: true, // Set to false to use real API calls

  // API Configuration
  API_BASE_URL: "http://localhost:3001/api",

  // Mock Data Configuration
  MOCK_DELAY_MS: {
    GET_PHONES: 500,
    GET_PHONE_BY_ID: 300,
    GET_PHONES_BY_BRAND: 400,
    GET_AVAILABLE_BRANDS: 200,
    SEARCH_PHONES: 300,
    GET_PROMOTIONAL_PHONES: 400,
  },

  // Development flags
  ENABLE_CONSOLE_LOGS: true,

  // Feature flags
  FEATURES: {
    ENABLE_PROMOTIONS: true,
    ENABLE_PRICE_FILTERING: true,
    ENABLE_SEARCH: true,
    ENABLE_5G_FILTERING: true,
  },
};

// Helper function to check if mock data should be used
export const shouldUseMockData = (): boolean => {
  return ServiceConfig.USE_MOCK_DATA;
};

// Helper function to log service actions
export const logServiceAction = (action: string, details?: any): void => {
  if (ServiceConfig.ENABLE_CONSOLE_LOGS) {
    const prefix = ServiceConfig.USE_MOCK_DATA ? "📱 MOCK" : "🌐 API";
    console.log(`${prefix} - ${action}`, details || "");
  }
};

export default ServiceConfig;
