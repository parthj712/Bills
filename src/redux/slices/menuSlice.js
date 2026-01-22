import { getMenuItems } from "@/service/menuService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    const res = await getMenuItems();
    return res.data; // API response
  },
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default menuSlice.reducer;
