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

export const createItem = createAsyncThunk("table/createItem", async (item: Omit<TableItem, "id">, thunkAPI) => {
  try {
    return await createTableItem(item);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateItem = createAsyncThunk("table/updateItem", async (updatedItem: TableItem, thunkAPI) => {
  try {
    return await updateTableItem(updatedItem.id, updatedItem);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteItem = createAsyncThunk("table/deleteItem", async (id: string, thunkAPI) => {
  try {
    return await deleteTableItem(id);
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
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<TableItem>) => {
        state.data.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<TableItem>) => {
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.data = state.data.filter(item => item.id !== action.payload);
      });
  },
});

export default tableSlice.reducer;
