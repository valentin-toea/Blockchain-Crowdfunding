import { styled } from "@stitches/react";
import Card from "../../../components/Card";
import Switch from "../../../components/common/Switch";
import RewardCard from "../../../components/RewardCard";
import {
  newProjectActions,
  selectNewProject,
  setField,
} from "../../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { PlusCircle as PlusIcon } from "@styled-icons/boxicons-regular/PlusCircle";
import { theme } from "../../../theme";
import TextField from "../../../components/common/TextField";
import { useEffect } from "react";
import {
  editProjectActions,
  selectEditProject,
} from "../../../slices/editProjectSlice";

const RewardsStep = ({ editMode = false }) => {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  );

  useEffect(() => {
    if (fields.rewards.some((reward) => reward.isEditable === true)) {
      dispatch(
        (!editMode ? newProjectActions : editProjectActions).setInvalidField([
          "step5",
        ])
      );
    } else
      dispatch(
        (!editMode
          ? newProjectActions
          : editProjectActions
        ).removeInvalidFields(["step5"])
      );
  }, [dispatch, fields.rewards, editMode]);

  const isEditing = fields.rewards.some((item) => item.isEditable);

  const saveReward = (index: number, reward: ProjectReward) =>
    dispatch(
      (!editMode ? newProjectActions : editProjectActions).updateReward({
        index,
        reward,
      })
    );

  const removeReward = (index: number) =>
    dispatch(
      (!editMode ? newProjectActions : editProjectActions).removeReward(index)
    );

  return (
    <StepBody>
      <Side>
        {fields.benefitType === "rewards" && (
          <RewardsGrid>
            {fields.rewards.map((reward: ProjectReward, index) => (
              <RewardCard
                key={index}
                index={index}
                {...reward}
                onSave={(index, reward) => saveReward(index, reward)}
                onDelete={(index) => removeReward(index)}
              />
            ))}
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                cursor: "pointer",
                background: theme.colors.white.toString(),
                borderRadius: theme.radii.xl2.toString(),
                boxShadow: theme.shadows.boxShadow1.toString(),
                padding: 20,
                minHeight: 370,
                ...(isEditing && { filter: "brightness(0.7)" }),
              }}
              disabled={isEditing}
              onClick={() => dispatch(newProjectActions.addNewReward())}
            >
              <PlusIcon
                size={120}
                style={{ color: theme.colors.violet400.toString() }}
              />
              <span style={{ fontSize: 18 }}>New Reward</span>
            </button>
          </RewardsGrid>
        )}
      </Side>
    </StepBody>
  );
};

export default RewardsStep;

const StepBody = styled("div", {
  display: " grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 15,
});

const Side = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 15,
});

const RewardsGrid = styled("div", {
  width: "100%",
  display: " grid",
  gridTemplateColumns: "repeat(auto-fill, 350px)",
  gap: 15,
});
