import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";

export interface SearchPageState {
  projects: Project[];
  loading: boolean;
  cached: boolean;
}

const initialState: SearchPageState = {
  projects: [],
  loading: false,
  cached: false,
};

export const searchPageSlice = createSlice({
  name: "searchPage",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.projects = [];
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload || [];
        state.loading = false;
      });

    builder
      .addCase(getFilteredProjects.pending, (state) => {
        state.loading = true;
        state.projects = [];
      })
      .addCase(getFilteredProjects.fulfilled, (state, action) => {
        state.projects = action.payload || [];
        state.loading = false;
      });
  },
});

const getAllProjects = createAsyncThunk("homePage/getAllProjects", async () => {
  let { data: projects, error } = await supabase
    .from("projects")
    .select(`*, user: profiles!userId(*)`)
    .order("id", { ascending: true });

  return projects;
});

const getFilteredProjects = createAsyncThunk(
  "homePage/getFilteredProjects",
  async ({ text }: { text: string }) => {
    let { data, error } = await supabase
      .from<Project>("projects")
      .select("*, user: profiles!userId(*)")
      .ilike("title", `%${text}%`);

    return data;
  }
);

export const searchPageActions = {
  ...searchPageSlice.actions,
  getAllProjects,
  getFilteredProjects,
};

export const selectSearchPageState = (state: RootState) => state.searchPage;

export default searchPageSlice.reducer;
