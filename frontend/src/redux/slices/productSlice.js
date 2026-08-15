import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState = {
  items: [],
  pagination: { page: 1, limit: 12, totalResults: 0, totalPages: 1 },
  featured: [],
  bestSellers: [],
  activeProduct: null,
  listStatus: 'idle', // idle | loading | succeeded | failed
  detailStatus: 'idle',
  mutationStatus: 'idle', // for admin create/update/delete
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await productApi.getProducts(params);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load products.'));
  }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (limit, { rejectWithValue }) => {
  try {
    const { data } = await productApi.getFeatured(limit);
    return data.data.products;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load featured products.'));
  }
});

export const fetchBestSellers = createAsyncThunk('products/fetchBestSellers', async (limit, { rejectWithValue }) => {
  try {
    const { data } = await productApi.getBestSellers(limit);
    return data.data.products;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load best sellers.'));
  }
});

export const fetchProductByIdOrSlug = createAsyncThunk(
  'products/fetchOne',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const { data } = await productApi.getProduct(idOrSlug);
      return data.data.product;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Product not found.'));
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async ({ payload, imageFiles }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.createProduct(payload, imageFiles);
      return data.data.product;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create product.'));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, payload, imageFiles, removedImageIds }, { rejectWithValue }) => {
    try {
      const { data } = await productApi.updateProduct(id, payload, imageFiles, removedImageIds);
      return data.data.product;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update product.'));
    }
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productApi.deleteProduct(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete product.'));
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearActiveProduct: (state) => {
      state.activeProduct = null;
      state.detailStatus = 'idle';
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchProducts.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload;
      })

      // Featured / Best sellers
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload;
      })

      // Single product
      .addCase(fetchProductByIdOrSlug.pending, (state) => {
        state.detailStatus = 'loading';
        state.activeProduct = null;
        state.error = null;
      })
      .addCase(fetchProductByIdOrSlug.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.activeProduct = action.payload;
      })
      .addCase(fetchProductByIdOrSlug.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })

      // Admin mutations
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.map((p) => (p._id === action.payload._id ? action.payload : p));
        if (state.activeProduct?._id === action.payload._id) state.activeProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearActiveProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
