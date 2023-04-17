import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";
import { transactionActions } from "./transactionSlice";

export interface UserState {
  value: any;
  profile: UserProfile;
}

const initialState: UserState = {
  value: { logged: false },
  profile: {
    id: "-1",
    firstName: "",
    lastName: "",
    wallet: "",
    userId: "",
    description: "",
    public: false,
    email: "",
    address: null,
    companyName: "",
    hasCompany: false,
    companyEmail: "",
    phone: "",
    companyDescription: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object | null>) => {
      state.value = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
});

export const getUserProfile =
  (userId: string): AppThunk =>
  async (dispatch) => {
    let { data, error } = await supabase
      .from<UserProfile & { id: string }>("profiles")
      .select("*")
      .eq("userId", userId)
      .single();
    if (!error && data) {
      dispatch(setProfile(data));
    }
  };

export const setUserWallet =
  (wallet: string): AppThunk =>
  async (dispatch, getState) => {
    const userId = (selectUser(getState()) as any).id;

    const { data, error } = await supabase
      .from<UserProfile>("profiles")
      .update({ wallet })
      .eq("userId", userId)
      .single();

    if (!error && data) {
      dispatch(setProfile(data));
      toast.success("Wallet connected successfully.");
    }
  };

const updateUserInfo =
  (
    firstName: string,
    lastName: string,
    description: string,
    country: string,
    residence: string,
    phone: string
  ): AppThunk =>
  async (dispatch, getState) => {
    const currentProfile = selectUserProfile(getState()).id;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        firstName,
        lastName,
        description,
        phone,
        address: {
          country,
          residence,
        },
      })
      .eq("id", currentProfile)
      .single();

    if (error) toast.error(error);
    if (!error && data) {
      dispatch(setProfile(data));
      toast.success("Profile info updated successfully.");
    }
  };

const setHasCompany =
  (hasCompany: boolean): AppThunk =>
  async (dispatch, getState) => {
    const currentProfile = selectUserProfile(getState()).id;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        hasCompany,
      })
      .eq("id", currentProfile)
      .single();

    if (!error && data) {
      dispatch(setProfile(data));
    }
  };

const updateCompanyProfile =
  (
    hasCompany: boolean,
    companyName: string,
    companyEmail: string,
    companyDescription: string
  ): AppThunk =>
  async (dispatch, getState) => {
    const currentProfile = selectUserProfile(getState()).id;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        hasCompany,
        companyName,
        companyEmail,
        companyDescription,
      })
      .eq("id", currentProfile)
      .single();

    if (error) toast.error(error);
    if (!error && data) {
      dispatch(setProfile(data));
      toast.success("Company profile updated successfully.");
    }
  };

export const { setUser, setProfile } = userSlice.actions;

export const userSliceActions = {
  ...userSlice.actions,
  updateUserInfo,
  updateCompanyProfile,
  setHasCompany,
};

export const selectUser = (state: RootState) => state.user.value;
export const selectUserProfile = (state: RootState) => state.user.profile;

export default userSlice.reducer;
