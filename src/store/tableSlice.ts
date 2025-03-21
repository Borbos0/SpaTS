import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTableData, createTableItem, deleteTableItem, updateTableItem, TableItem } from "../api/table";

interface TableState {
  data: TableItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  data: [],
  loading: false,
  error: null,
};

export const loadTableData = createAsyncThunk("table/loadTableData", async (_, thunkAPI) => {
  try {
    return await fetchTableData();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTableData.fulfilled, (state, action: PayloadAction<TableItem[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadTableData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tableSlice.reducer;
