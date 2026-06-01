import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertyService } from '@/services/property.service';
import { Property, PropertyFilters, CreatePropertyDto } from '@/types/property.types';

interface PropertiesState {
  items: Property[];
  currentProperty: Property | null;
  myProperties: Property[];
  filters: PropertyFilters;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  loading: boolean;
  error: string | null;
}

const initialState: PropertiesState = {
  items: [],
  currentProperty: null,
  myProperties: [],
  filters: {},
  pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  loading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (
    params: { filters?: PropertyFilters; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      return await propertyService.getProperties(params.filters, params.page, params.limit);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to load properties');
    }
  },
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await propertyService.getPropertyById(id);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Property not found');
    }
  },
);

export const fetchMyProperties = createAsyncThunk(
  'properties/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      return await propertyService.getMyProperties();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to load your properties');
    }
  },
);

export const createProperty = createAsyncThunk(
  'properties/create',
  async (dto: CreatePropertyDto, { rejectWithValue }) => {
    try {
      return await propertyService.createProperty(dto);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to create property');
    }
  },
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<PropertyFilters>) {
      state.filters = action.payload;
    },
    clearCurrentProperty(state) {
      state.currentProperty = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myProperties = action.payload.data;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.myProperties.unshift(action.payload);
      });
  },
});

export const { setFilters, clearCurrentProperty, clearError } = propertiesSlice.actions;
export default propertiesSlice.reducer;

export const selectProperties = (state: { properties: PropertiesState }) =>
  state.properties.items;
export const selectCurrentProperty = (state: { properties: PropertiesState }) =>
  state.properties.currentProperty;
export const selectMyProperties = (state: { properties: PropertiesState }) =>
  state.properties.myProperties;
export const selectPropertyFilters = (state: { properties: PropertiesState }) =>
  state.properties.filters;
export const selectPropertyPagination = (state: { properties: PropertiesState }) =>
  state.properties.pagination;
export const selectPropertiesLoading = (state: { properties: PropertiesState }) =>
  state.properties.loading;
