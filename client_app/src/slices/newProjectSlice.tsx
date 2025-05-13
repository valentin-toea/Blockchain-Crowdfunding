import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { RootState, AppThunk, AppDispatch } from "../store/store";
import { supabase } from "../supabaseClient";
import { v4 as uuid } from "uuid";

type NewProjectState = Project & { invalidFields?: string[] };

const initialState: NewProjectState = {
  images: [],
  userId: "",
  mainImage: "",
  categories: [],
  title: "",
  shortDescription: "",
  description: "<p><br></p>",
  goal: "",
  minimumContribution: "",
  startDate: new Date().toLocaleDateString("en-GB"),
  endDate: new Date().toLocaleDateString("en-GB"),
  country: "",
  benefitType: "rewards",
  rewards: [{ title: "", threshold: 0, description: "", isEditable: true }],
  equityRule: {
    allocatedPercentage: 0,
    maxPercentagePerUser: 0,
    minimumThreshold: 0,
  },
  wallet: "",
  contractRef: "",
  invalidFields: [],
};

export const newProjectSlice = createSlice({
  name: "newProject",
  initialState,
  reducers: {
    setInvalidField: (state, action: PayloadAction<string[]>) => {
      if (state.invalidFields?.includes(action.payload[0])) return;

      let intermArr = [...(state.invalidFields || []), ...action.payload];
      state.invalidFields = [
        ...intermArr.sort((a: string, b: string) => {
          let valA = parseInt(a.split("step")[1]);
          let valB = parseInt(b.split("step")[1]);

          return valA - valB;
        }),
      ];
    },
    removeInvalidFields: (state, action: PayloadAction<string[]>) => {
      state.invalidFields = [
        ...(state.invalidFields || []).filter(
          (item) => !action.payload.some((x) => x === item)
        ),
      ];
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setField: (
      state,
      action: PayloadAction<{ fieldName: string; value: string | number }>
    ) => {
      state[action.payload.fieldName] = action.payload.value;
    },
    addProjectImage: (
      state,
      action: PayloadAction<{ images: string[]; mainImage: string }>
    ) => {
      state.images = action.payload.images;
      state.mainImage = action.payload.mainImage;
    },
    addNewReward: (state) => {
      state.rewards = [
        ...state.rewards,
        { title: "", threshold: 0, description: "", isEditable: true },
      ];
    },
    updateReward: (
      state,
      action: PayloadAction<{
        index: number;
        reward: ProjectReward;
      }>
    ) => {
      state.rewards = state.rewards.map((reward, index) => {
        if (index === action.payload.index) {
          reward = action.payload.reward;
        }
        return reward;
      });
    },
    removeReward: (state, action: PayloadAction<number>) => {
      state.rewards = state.rewards.filter(
        (_, index) => index !== action.payload
      );
    },
    updateEquityRule: (
      state,
      action: PayloadAction<{ fieldName: string; value: number | null }>
    ) => {
      state.equityRule[action.payload.fieldName] = action.payload.value;
    },
    setProjectWallet: (state, action: PayloadAction<string>) => {
      state.wallet = action.payload;
    },
    setContractRef: (state, action: PayloadAction<string>) => {
      state.contractRef = action.payload;
    },
    resetNewProject: () => initialState,
  },
});

export const uploadProject =
  ({
    mainImageIndex,
    images,
  }: {
    mainImageIndex: number;
    images: File[];
  }): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    if (!images.length) return;

    const getBucketResponse = await supabase.storage.getBucket(
      "project-pictures"
    );

    if (getBucketResponse.error) {
      await supabase.storage.createBucket("project-pictures", { public: true });
    }

    let imageLinks: string[] = [];
    let mainImageLink = "";

    await Promise.all(
      images.map(async (image, index) => {
        const { data, error } = await supabase.storage
          .from("project-pictures")
          .upload(`public/${uuid()}.png`, image);

        if (error) {
        }

        if (data) {
          let imageLink: string = "/storage/v1/object/public/";
          imageLink += data.Key;

          if (index === mainImageIndex) {
            mainImageLink = imageLink;
          } else imageLinks = [...imageLinks, imageLink];
        }
      })
    );

    dispatch(addProjectImage({ images: imageLinks, mainImage: mainImageLink }));

    const project = { ...selectNewProject(getState()) };
    const payload = {
      ...project,
      startDate: new Date(
        parseInt(project.startDate.split("/")[2]),
        parseInt(project.startDate.split("/")[1]) - 1,
        parseInt(project.startDate.split("/")[0])
      ).toISOString(),
      endDate: new Date(
        parseInt(project.endDate.split("/")[2]),
        parseInt(project.endDate.split("/")[1]) - 1,
        parseInt(project.endDate.split("/")[0])
      ).toISOString(),
      images: imageLinks,
      mainImage: mainImageLink,
    };

    delete payload.invalidFields;

    let { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .single();

    dispatch(newProjectActions.setField({ fieldName: "id", value: data.id }));
  };

export const {
  setCategories,
  setField,
  resetNewProject,
  addProjectImage,
  addNewReward,
  setProjectWallet,
} = newProjectSlice.actions;

export const newProjectActions = newProjectSlice.actions;

export const selectNewProject = (state: RootState) => state.newProject;

export default newProjectSlice.reducer;
