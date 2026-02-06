import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTables, updateTableStatus } from "@/service/tableService";

export const fetchTables = createAsyncThunk(
  "tables/fetch",
  async () => await getTables(),
);

export const changeTableStatus = createAsyncThunk(
  "tables/changeStatus",
  async ({ tableId, status }) => {
    await updateTableStatus(tableId, status);
    return { tableId, status };
  },
);

const tableSlice = createSlice({
  name: "tables",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    updateTableFromSocket: (state, action) => {
      const table = state.list.find((t) => t._id === action.payload.tableId);
      if (table) {
        table.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});

export const { updateTableFromSocket } = tableSlice.actions;
export default tableSlice.reducer;
