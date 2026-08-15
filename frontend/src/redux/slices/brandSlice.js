import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandApi from '../../api/brandApi';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
};

export const fetchBrands = createAsyncThunk('brands/fetchAll', async (all = false, { rejectWithValue }) => {
  try {
    const { data } = await brandApi.getBrands(all);
    return data.data.brands;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load brands.'));
  }
});

export const createBrand = createAsyncThunk(
  'brands/create',
  async ({ payload, logoFile }, { rejectWithValue }) => {
    try {
      const { data } = await brandApi.createBrand(payload, logoFile);
      return data.data.brand;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create brand.'));
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/update',
  async ({ id, payload, logoFile }, { rejectWithValue }) => {
    try {
      const { data } = await brandApi.updateBrand(id, payload, logoFile);
      return data.data.brand;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update brand.'));
    }
  }
);

export const deleteBrand = createAsyncThunk('brands/delete', async (id, { rejectWithValue }) => {
  try {
    await brandApi.deleteBrand(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete brand.'));
  }
});

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBrand.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.items = state.items.map((b) => (b._id === action.payload._id ? action.payload : b));
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;
