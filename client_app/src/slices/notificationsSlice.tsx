import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export interface Notification {
  id: string;
  message: string;
  userId?: string;
  projectId?: string;
  createdAt?: string;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
};

export const notificationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => {
      if (subscription) supabase.removeSubscription(subscription);
      return { ...initialState };
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<Notification | Notification[]>
    ) => {
      state.notifications = Array.isArray(action.payload)
        ? [...action.payload, ...state.notifications]
        : [action.payload, ...state.notifications];
    },
  },
});

let subscription: any;

const fetchNotifications =
  (userId: string): AppThunk =>
  async (dispatch, getState) => {
    let { data, error } = await supabase
      .from<Notification>("notifications")
      .select(`*`)
      .eq("userId", userId)
      .order("createdAt", { ascending: false })
      .limit(20);

    if (!error && data) {
      dispatch(notificationActions.setNotifications(data));
      dispatch(subscribeToNotifications(userId));
    }
  };

const subscribeToNotifications =
  (userId: string): AppThunk =>
  async (dispatch) => {
    subscription = supabase
      .from(`notifications`)
      .on("*", (payload) => {
        if (payload.new && payload.new.userId?.includes(userId)) {
          dispatch(notificationActions.addNotification(payload.new));
          toast.info(
            <Link to={`/project/${payload.new.projectId}`}>
              {payload.new.message}
            </Link>
          );
        }
      })
      .subscribe();
  };

export const notificationActions = {
  ...notificationSlice.actions,
  fetchNotifications,
};

export const selectNotifications = (state: RootState) =>
  state.notificationManager;

export default notificationSlice.reducer;
