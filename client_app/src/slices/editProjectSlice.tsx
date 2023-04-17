import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store/store";
import { supabase } from "../supabaseClient";
import { cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";

type EditProjectState = Project & { invalidFields?: string[] };

const initialState: EditProjectState = {
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

export const editProjectSlice = createSlice({
  name: "project",
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
    loadData: (_, action: PayloadAction<Project>) => {
      return cloneDeep({
        ...action.payload,
        startDate: action.payload.startDate
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/"),
        endDate: action.payload.endDate
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/"),
      });
    },
  },
});

export const uploadChanges =
  ({
    mainImageIndex,
    images,
    projectId,
  }: {
    mainImageIndex: number;
    images: File[];
    projectId: string;
  }): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    if (!images.length) return;

    const getBucketResponse = await supabase.storage.getBucket(
      "projectPictures"
    );

    if (getBucketResponse.error) {
      await supabase.storage.createBucket("projectPictures", { public: true });
    }

    let imageLinks: string[] = [];
    let mainImageLink = "";

    await Promise.all(
      images.map(async (image, index) => {
        const { data, error } = await supabase.storage
          .from("projectPictures")
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

    dispatch(
      editProjectActions.addProjectImage({
        images: imageLinks,
        mainImage: mainImageLink,
      })
    );

    const project = { ...selectEditProject(getState()) };

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
      .update(payload)
      .eq("id", projectId)
      .single();

    console.log(data, error);
    //dispatch(editProjectActions.setField({ fieldName: "id", value: data.id }));
  };

export const editProjectActions = {
  ...editProjectSlice.actions,
  uploadChanges,
};

export const selectEditProject = (state: RootState) => state.editProject;

export default editProjectSlice.reducer;
