import { styled } from "@stitches/react";
import { useEffect, useState } from "react";
import Stepper from "../../components/common/Stepper";
import { Category as CategoryIcon } from "@styled-icons/boxicons-regular/Category";
import Button from "../../components/common/Button";
import { Separator } from "../../components/common/Separator";
import {
  newProjectActions,
  resetNewProject,
  selectNewProject,
  setField,
  setProjectWallet,
} from "../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import LastStep from "./components/LastStep";
import { theme } from "../../theme";
import { LeftArrowAlt as ArrowIcon } from "@styled-icons/boxicons-regular/LeftArrowAlt";
import RewardsStep from "./components/RewardsStep";
import { selectUserProfile } from "../../slices/userSlice";
import WalletStep from "./components/WalletStep";
import { useNavigate, useParams } from "react-router-dom";
import StoryStep from "./components/StoryStep";
import { LoadingOverlay } from "@mantine/core";
import Snackbar from "../../layout/Snackbar/Snackbar";
import { toast } from "react-toastify";
import {
  editProjectActions,
  selectEditProject,
} from "../../slices/editProjectSlice";
import { supabase } from "../../supabaseClient";
import { STORAGE_URL } from "../../utils";

const stepOptions = [
  { name: "Category", icon: <CategoryIcon /> },
  { name: "Project Details", icon: <CategoryIcon /> },
  { name: "Images", icon: <CategoryIcon /> },
  { name: "Story", icon: <CategoryIcon /> },
  { name: "Rewards", icon: <CategoryIcon /> },
  { name: "Wallet & Profile", icon: <CategoryIcon /> },
  { name: "Preview", icon: <CategoryIcon /> },
];

const CreateProjectPage = ({ editMode = false }) => {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectUserProfile);
  const navigate = useNavigate();
  const params = useParams();

  const invalidFields = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  ).invalidFields;

  const canGoNext = !(
    !!invalidFields?.length && invalidFields[0] === `step${step + 1}`
  );

  useEffect(() => {
    if (editMode) {
      (async () => {
        setLoading(true);

        const { data, error } = await supabase
          .from<Project>("projects")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!error && data) {
          dispatch(editProjectActions.loadData(data));
          const savedImages = [data.mainImage, ...data.images];
          const finalImages = [];
          for (let i = 0; i < savedImages.length; i++) {
            const response = await fetch(STORAGE_URL + savedImages[i]);
            // here image is url/location of image
            const blob = await response.blob();
            const file = new File([blob], `${savedImages[i]}.jpg`, {
              type: blob.type,
            });
            finalImages.push(file);
          }
          setImages(finalImages);
        }

        setLoading(false);
      })();
    }
  }, [editMode, params.id, dispatch]);

  useEffect(() => {
    //add user id when starting a new project
    dispatch(setField({ fieldName: "userId", value: loggedUser.id || -1 }));
    dispatch(
      editProjectActions.setField({
        fieldName: "userId",
        value: loggedUser.id || -1,
      })
    );

    dispatch(setProjectWallet(loggedUser.wallet));
    dispatch(editProjectActions.setProjectWallet(loggedUser.wallet));

    //set invalid categories -> 0 at the start
    dispatch(
      newProjectActions.setInvalidField(["step1", "step2", "step4", "step5"])
    );

    //reset project data on exit
    return () => {
      dispatch(resetNewProject());
      dispatch(editProjectActions.resetNewProject());
    };
  }, [dispatch, loggedUser.id, loggedUser.wallet]);

  const handlePrevious = () =>
    setStep((step) => {
      if (step - 1 < 0) return 0;
      return step - 1;
    });

  const handleNext = () => {
    if (canGoNext) {
      setStep((step) => {
        if (step + 1 >= stepOptions.length) return stepOptions.length - 1;
        return step + 1;
      });
    } else toast.warning("Current step is not complete.");
  };

  return (
    <PageBody>
      <Content>
        <div
          style={{
            background: theme.colors.appBackground.toString(),
            zIndex: 2,
            marginBottom: 30,
            marginTop: 30,
          }}
        >
          <CategoryHeader>
            <Button
              style={{
                background: "transparent",
                color: "black",
                maxWidth: "fit-content",
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowIcon size={20} />
              Go back
            </Button>
            <h2 style={{ lineHeight: "40px" }}>
              {!editMode
                ? "Create your own campaign"
                : `Edit Campaign: ${params?.projectName}`}
            </h2>
            <ButtonsWrapper>
              <Button
                color="neutral300"
                css={{ fontSize: 14 }}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              {step !== stepOptions.length - 1 ? (
                <Button
                  color="violet400"
                  css={{ fontSize: 14, minWidth: 80 }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  color="violet400"
                  css={{ fontSize: 14, minWidth: 80 }}
                  onClick={handleNext}
                >
                  Finish
                </Button>
              )}
            </ButtonsWrapper>
          </CategoryHeader>
          <Separator css={{ marginTop: "30px" }} />
        </div>
        <StepWrapper>
          <LoadingOverlay visible={loading} />
          <Stepper
            style={{
              maxHeight: 600,
              maxWidth: 100,
            }}
            options={stepOptions}
            step={step}
            canGoNext={canGoNext}
            onChange={(index) => setStep(index)}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: 1200, width: "100%" }}>
              {[
                <Step1 editMode={editMode} />,
                <Step2 editMode={editMode} />,
                <Step3
                  editMode={editMode}
                  images={images}
                  setImages={setImages}
                  mainImageIndex={mainImageIndex}
                  setMainImageIndex={setMainImageIndex}
                />,
                <StoryStep editMode={editMode} />,
                <RewardsStep editMode={editMode} />,
                <WalletStep />,
                <LastStep
                  editMode={editMode}
                  images={images}
                  mainImageIndex={mainImageIndex}
                  setLoading={setLoading}
                />,
              ].find((_, index) => index === step)}
            </div>
          </div>
        </StepWrapper>
      </Content>
      <Snackbar />
    </PageBody>
  );
};

export default CreateProjectPage;

const PageBody = styled("div", {
  minHeight: "100vh",
  display: "flex",
  gap: 15,
  backgroundColor: theme.colors.appBackground,
});

const Content = styled("div", {
  width: "100%",
  padding: `0px 50px`,
});

const CategoryHeader = styled("div", {
  height: "min-content",
  display: "flex",
  alignContent: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingTop: 20,
});

const ButtonsWrapper = styled("div", {
  display: "flex",
  height: "min-content",
  gap: 20,
});

const StepWrapper = styled("div", {
  display: "flex",
  gap: 60,
  width: "100%",

  "& > div": {
    width: "100%",
  },
});
