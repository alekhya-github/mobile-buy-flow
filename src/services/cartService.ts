import axios from "axios";
import { ServiceConfig } from "./serviceConfig";

const API_BASE_URL = ServiceConfig.API_BASE_URL;

export interface CartPayload {
  fulfillmentMethod: string;
  items: CartItemPayload[];
}

export interface CartItemPayload {
  itemType: string;
  type: string;
  sku: string;
  productDetail: {
    nickname: string;
    portInfo: {
      portingFlag: string;
    };
    servicePlans: ServicePlanPayload[];
  };
  simType: string;
}

export interface ServicePlanPayload {
  planType: string;
  selectedPlanId: string;
}

export interface CartResponse {
  id: string;
  contactEmail: string;
  contactNumber: string;
  shippingAddress: any;
  shippingMethod: any;
  price: {
    monthlyRecurringCharge: number;
    monthlyRecurringTax: number;
    oneTimeCharge: number;
    oneTimeTax: number;
    monthlyRecurringTotal: number;
    oneTimeTotal: number;
  };
  items: any[];
  orderId: {
    key: string;
    value: string;
  };
  messages: any;
  watchInCart: boolean;
  taxSummary: any;
  cartMinDownPayment: number;
  customerEnterdDownPayment: number;
  addaline: boolean;
  pbbInfo: any;
}

export const addToCart = async (
  payload: CartPayload,
): Promise<CartResponse> => {
  try {
    const response = await axios.post<CartResponse>(
      `${API_BASE_URL}/cart`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
