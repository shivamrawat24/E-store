import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState = {
  items: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (all = false, { rejectWithValue }) => {
  try {
    const { data } = await categoryApi.getCategories(all);
    return data.data.categories;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load categories.'));
  }
});

export const createCategory = createAsyncThunk(
  'categories/create',
  async ({ payload, imageFile }, { rejectWithValue }) => {
    try {
      const { data } = await categoryApi.createCategory(payload, imageFile);
      return data.data.category;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create category.'));
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, payload, imageFile }, { rejectWithValue }) => {
    try {
      const { data } = await categoryApi.updateCategory(id, payload, imageFile);
      return data.data.category;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update category.'));
    }
  }
);

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    await categoryApi.deleteCategory(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete category.'));
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.items = state.items.map((c) => (c._id === action.payload._id ? action.payload : c));
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
