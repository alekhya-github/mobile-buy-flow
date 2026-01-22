import React, { createContext, useContext, useState, ReactNode } from "react";

// ============================================
// Step 1: Define what data we want to store
// ============================================
// This is like a shopping cart that holds ALL your selections throughout the buy flow

// Phone Details Section
interface PhoneDetails {
  phoneId: string | null;
  phoneBrand: string | null;
  phoneModel: string | null;
  phoneImage: string | null;
  selectedColor: string | null;
  selectedColorHex: string | null;
  selectedStorage: string | null;
  fullPrice: string | null;
  monthlyPrice: string | null;
}

// Trade-In Details Section
interface TradeInDetails {
  hasTradeIn: boolean;
  tradeInDevice: string | null;
  tradeInValue: string | null;
  tradeInCondition: string | null;
}

// Plan Details Section
interface PlanDetails {
  planId: string | null;
  planName: string | null;
  planPrice: string | null;
  dataAllowance: string | null;
}

// Port-In Details Section
interface PortInDetails {
  isPortingNumber: boolean;
  currentCarrier: string | null;
  phoneNumber: string | null;
  accountNumber: string | null;
  pin: string | null;
}

// Insurance Plan Details Section
interface InsurancePlanDetails {
  hasInsurance: boolean;
  insurancePlanId: string | null;
  insurancePlanName: string | null;
  insurancePrice: string | null;
}

// Customer Details Section
interface CustomerDetails {
  isExistingCustomer: boolean;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
}

// Complete Buy Flow State - combines all sections
interface MobileBuyFlowState {
  phoneDetails: PhoneDetails;
  tradeInDetails: TradeInDetails;
  planDetails: PlanDetails;
  portInDetails: PortInDetails;
  insurancePlanDetails: InsurancePlanDetails;
  customerDetails: CustomerDetails;
}

// ============================================
// Step 2: Define the functions to manage data
// ============================================
interface MobileBuyFlowContextType {
  state: MobileBuyFlowState;

  // Update individual sections
  updatePhoneDetails: (data: Partial<PhoneDetails>) => void;
  updateTradeInDetails: (data: Partial<TradeInDetails>) => void;
  updatePlanDetails: (data: Partial<PlanDetails>) => void;
  updatePortInDetails: (data: Partial<PortInDetails>) => void;
  updateInsurancePlanDetails: (data: Partial<InsurancePlanDetails>) => void;
  updateCustomerDetails: (data: Partial<CustomerDetails>) => void;

  // Clear entire flow (start over)
  clearBuyFlow: () => void;
}

// ============================================
// Step 3: Create the Context (the shopping cart)
// ============================================
const MobileBuyFlowContext = createContext<
  MobileBuyFlowContextType | undefined
>(undefined);

// Initial empty state
const initialState: MobileBuyFlowState = {
  phoneDetails: {
    phoneId: null,
    phoneBrand: null,
    phoneModel: null,
    phoneImage: null,
    selectedColor: null,
    selectedColorHex: null,
    selectedStorage: null,
    fullPrice: null,
    monthlyPrice: null,
  },
  tradeInDetails: {
    hasTradeIn: false,
    tradeInDevice: null,
    tradeInValue: null,
    tradeInCondition: null,
  },
  planDetails: {
    planId: null,
    planName: null,
    planPrice: null,
    dataAllowance: null,
  },
  portInDetails: {
    isPortingNumber: false,
    currentCarrier: null,
    phoneNumber: null,
    accountNumber: null,
    pin: null,
  },
  insurancePlanDetails: {
    hasInsurance: false,
    insurancePlanId: null,
    insurancePlanName: null,
    insurancePrice: null,
  },
  customerDetails: {
    isExistingCustomer: false,
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null,
  },
};

// ============================================
// Step 4: Create the Provider (manages the cart)
// ============================================
export const MobileBuyFlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<MobileBuyFlowState>(initialState);

  // Update phone details
  const updatePhoneDetails = (data: Partial<PhoneDetails>) => {
    setState((prev) => ({
      ...prev,
      phoneDetails: { ...prev.phoneDetails, ...data },
    }));
  };

  // Update trade-in details
  const updateTradeInDetails = (data: Partial<TradeInDetails>) => {
    setState((prev) => ({
      ...prev,
      tradeInDetails: { ...prev.tradeInDetails, ...data },
    }));
  };

  // Update plan details
  const updatePlanDetails = (data: Partial<PlanDetails>) => {
    setState((prev) => ({
      ...prev,
      planDetails: { ...prev.planDetails, ...data },
    }));
  };

  // Update port-in details
  const updatePortInDetails = (data: Partial<PortInDetails>) => {
    setState((prev) => ({
      ...prev,
      portInDetails: { ...prev.portInDetails, ...data },
    }));
  };

  // Update insurance plan details
  const updateInsurancePlanDetails = (data: Partial<InsurancePlanDetails>) => {
    setState((prev) => ({
      ...prev,
      insurancePlanDetails: { ...prev.insurancePlanDetails, ...data },
    }));
  };

  // Update customer details
  const updateCustomerDetails = (data: Partial<CustomerDetails>) => {
    setState((prev) => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, ...data },
    }));
  };

  // Clear entire buy flow
  const clearBuyFlow = () => {
    setState(initialState);
  };

  return (
    <MobileBuyFlowContext.Provider
      value={{
        state,
        updatePhoneDetails,
        updateTradeInDetails,
        updatePlanDetails,
        updatePortInDetails,
        updateInsurancePlanDetails,
        updateCustomerDetails,
        clearBuyFlow,
      }}
    >
      {children}
    </MobileBuyFlowContext.Provider>
  );
};

// ============================================
// Step 5: Create a hook to easily use the context
// ============================================
export const useMobileBuyFlow = () => {
  const context = useContext(MobileBuyFlowContext);
  if (context === undefined) {
    throw new Error(
      "useMobileBuyFlow must be used within MobileBuyFlowProvider",
    );
  }
  return context;
};
