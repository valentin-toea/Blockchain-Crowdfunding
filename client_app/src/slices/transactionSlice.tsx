import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";

export interface TransactionState {
  [key: string]: any;
  loading: boolean;
}

const initialState: TransactionState = {
  loading: false,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const transactionActions = transactionSlice.actions;

export const selectTransaction = (state: RootState) => state.transaction;

export default transactionSlice.reducer;
