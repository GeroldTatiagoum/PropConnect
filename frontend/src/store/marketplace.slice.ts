import { createSlice } from '@reduxjs/toolkit';

interface MarketData {
  zone: string;
  avgPricePerSqm: number;
  trend6m: number;
  trend12m: number;
  trend24m: number;
}

interface Valuation {
  propertyId: string;
  estimatedPrice: number;
  pricePerSqm: number;
  confidence: number;
  comparables: string[];
}

interface MarketplaceState {
  marketData: MarketData | null;
  comparables: string[];
  valuation: Valuation | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarketplaceState = {
  marketData: null,
  comparables: [],
  valuation: null,
  loading: false,
  error: null,
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    clearMarketplaceError(state) {
      state.error = null;
    },
  },
});

export const { clearMarketplaceError } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
