import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';
import { getErrorMessage } from '../../utils/getErrorMessage';

const initialState = {
  // Checkout flow
  checkoutOrder: null, // { order, razorpayOrder, keyId } from createOrder
  createStatus: 'idle',
  verifyStatus: 'idle',

  // Customer order history
  myOrders: [],
  myOrdersPagination: { page: 1, limit: 10, totalResults: 0, totalPages: 1 },
  myOrdersStatus: 'idle',

  // Single order (customer detail view or admin detail view)
  activeOrder: null,
  detailStatus: 'idle',

  // Admin order management
  adminOrders: [],
  adminOrdersPagination: { page: 1, limit: 20, totalResults: 0, totalPages: 1 },
  adminListStatus: 'idle',
  adminMutationStatus: 'idle',

  error: null,
};

export const createOrder = createAsyncThunk('orders/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.createOrder(payload);
    return data.data; // { order, razorpayOrder, keyId }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create order.'));
  }
});

export const verifyPayment = createAsyncThunk('orders/verify', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.verifyPayment(payload);
    return data.data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Payment verification failed.'));
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.getMyOrders(params);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load your orders.'));
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.getOrder(id);
    return data.data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Order not found.'));
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllAdmin', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.getAllOrders(params);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load orders.'));
  }
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.updateOrderStatus(id, orderStatus);
      return data.data.order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update order status.'));
    }
  }
);

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderApi.cancelOrder(id);
    return data.data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to cancel order.'));
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCheckoutOrder: (state) => {
      state.checkoutOrder = null;
      state.createStatus = 'idle';
      state.verifyStatus = 'idle';
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
      state.detailStatus = 'idle';
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order (Razorpay order + pending Mongo order)
      .addCase(createOrder.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.checkoutOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })

      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.verifyStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifyStatus = 'succeeded';
        state.activeOrder = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifyStatus = 'failed';
        state.error = action.payload;
      })

      // My orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersStatus = 'succeeded';
        state.myOrders = action.payload.orders;
        state.myOrdersPagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersStatus = 'failed';
        state.error = action.payload;
      })

      // Single order
      .addCase(fetchOrder.pending, (state) => {
        state.detailStatus = 'loading';
        state.activeOrder = null;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.activeOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })

      // Admin: all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.adminListStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.adminListStatus = 'succeeded';
        state.adminOrders = action.payload.orders;
        state.adminOrdersPagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.adminListStatus = 'failed';
        state.error = action.payload;
      })

      // Admin: update status
      .addCase(updateOrderStatus.pending, (state) => {
        state.adminMutationStatus = 'loading';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.adminMutationStatus = 'succeeded';
        state.adminOrders = state.adminOrders.map((o) => (o._id === action.payload._id ? action.payload : o));
        if (state.activeOrder?._id === action.payload._id) state.activeOrder = action.payload;
        state.myOrders = state.myOrders.map((o) => (o._id === action.payload._id ? action.payload : o));
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.adminMutationStatus = 'failed';
        state.error = action.payload;
      })

      // Customer cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.activeOrder = action.payload;
        state.myOrders = state.myOrders.map((o) => (o._id === action.payload._id ? action.payload : o));
        state.adminOrders = state.adminOrders.map((o) => (o._id === action.payload._id ? action.payload : o));
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutOrder, clearActiveOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
