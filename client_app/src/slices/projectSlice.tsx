import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";

export interface ProjectPage {
  data: Project | null;
  loading: boolean;
  cached: boolean;
  similarResults: Project[];
}

const initialState: ProjectPage = {
  data: null,
  loading: false,
  cached: false,
  similarResults: [],
};

let raisedAmountSubscription: any;

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    reset: () => {
      if (raisedAmountSubscription)
        supabase.removeSubscription(raisedAmountSubscription);
      return { ...initialState };
    },
    loadProject: (state, action: PayloadAction<Project>) => {
      state.data = action.payload;
      state.cached = true;
    },
    setRaisedAmount: (state, action: PayloadAction<number>) => {
      if (state.data) state.data.raisedAmount = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setData: (state, action: PayloadAction<Project>) => {
      state.data = action.payload;
      state.cached = true;
    },
    setSimilarProjects: (state, action: PayloadAction<Project[]>) => {
      state.similarResults = action.payload;
    },
  },
});

const fetchProject =
  (projectId: string): AppThunk =>
  async (dispatch, getState) => {
    const { cached } = selectProject(getState());

    if (cached) return;

    dispatch(projectActions.setLoading(true));

    let { data, error } = await supabase
      .from<Project>("projects")
      .select(`*, user: profiles!userId(*)`)
      .eq("id", projectId)
      .single();

    if (!error && data) {
      dispatch(projectActions.setData(data));
    }

    dispatch(projectActions.setLoading(false));
  };

const fetchSimilarProjects =
  (projectId: string): AppThunk =>
  async (dispatch, getState) => {
    const { data: project } = selectProject(getState());
    const categories = project?.categories || [];
    //if (cached) return;

    let { data, error } = await supabase
      .from<Project>("projects")
      .select(`*, user: profiles!userId(*)`)
      .not("id", "eq", projectId)
      .overlaps("categories", categories)
      .limit(5);

    if (!error && data) {
      dispatch(projectActions.setSimilarProjects(data));
    }
  };

const subscribeToRaisedAmountChanges =
  (projectId: string): AppThunk =>
  async (dispatch) => {
    const subscription = supabase
      .from(`projects:id=eq.${projectId}`)
      .on("*", (payload) => {
        dispatch(projectActions.setRaisedAmount(payload.new.raisedAmount));
      })
      .subscribe();

    raisedAmountSubscription = subscription;
  };

export const projectActions = {
  ...projectSlice.actions,
  fetchProject,
  subscribeToRaisedAmountChanges,
  fetchSimilarProjects,
};

export const selectProject = (state: RootState) => state.project;

export default projectSlice.reducer;
