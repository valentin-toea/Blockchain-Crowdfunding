import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";

export interface HomePageState {
  projects: Project[];
  ongoingProjects: Project[];
  mostPopularProjects: Project[];
  loading: boolean;
  loading1: boolean;
  loading2: boolean;
  loading3: boolean;
  cached: boolean;
}

const initialState: HomePageState = {
  projects: [],
  ongoingProjects: [],
  mostPopularProjects: [],
  loading: false,
  loading1: false,
  loading2: false,
  loading3: false,
  cached: false,
};

export const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload || [];
        state.loading = false;
        state.cached = true;
      })

      .addCase(getOngoingProjects.pending, (state) => {
        state.loading1 = true;
      })
      .addCase(getOngoingProjects.fulfilled, (state, action) => {
        state.ongoingProjects = action.payload || [];
        state.loading1 = false;
      })

      .addCase(getMostPopularProjects.pending, (state) => {
        state.loading2 = true;
      })
      .addCase(getMostPopularProjects.fulfilled, (state, action) => {
        state.mostPopularProjects = action.payload || [];
        state.loading2 = false;
      });
  },
});

const getAllProjects = createAsyncThunk("homePage/getAllProjects", async () => {
  let { data: projects, error } = await supabase
    .from("projects")
    .select(`*, user: profiles!userId(*)`)
    .order("created_at", { ascending: false })
    .limit(10);
  return projects;
});

const getOngoingProjects = createAsyncThunk(
  "homePage/getOngoingProjects",
  async () => {
    const { data, error } = await supabase
      .rpc("filter_ongoing_projects")
      .select(`*, user: profiles!userId(*)`)
      .limit(10);

    return data;
  }
);

const getMostPopularProjects = createAsyncThunk(
  "homePage/getMostPopularProjects",
  async () => {
    const { data, error } = await supabase
      .rpc("filter_mostpopular_projects")
      .select(`*, user: profiles!userId(*)`)
      .limit(10);

    return data;
  }
);

export const homePageActions = {
  ...homePageSlice.actions,
  getAllProjects,
  getOngoingProjects,
  getMostPopularProjects,
};

export const selectHomePageState = (state: RootState) => state.homePage;

export default homePageSlice.reducer;
