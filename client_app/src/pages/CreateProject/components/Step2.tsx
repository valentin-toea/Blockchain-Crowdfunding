import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import MultilineTextField from "../../../components/common/MultilineTextField";
import TextField from "../../../components/common/TextField";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  newProjectActions,
  selectNewProject,
  setField,
} from "../../../slices/newProjectSlice";
import DatePicker from "../../../components/DatePicker";
import Card from "../../../components/Card";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";
import {
  editProjectActions,
  selectEditProject,
} from "../../../slices/editProjectSlice";

const Step2 = ({ editMode = false }) => {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  );

  const [errors, setErrors] = useState<any>({});

  const updateField = (fieldName: string, value: string | number) =>
    !editMode
      ? dispatch(setField({ fieldName, value }))
      : dispatch(editProjectActions.setField({ fieldName, value }));

  useEffect(() => {
    if (
      fields.title &&
      fields.shortDescription &&
      fields.goal &&
      fields.minimumContribution
    ) {
      !editMode
        ? dispatch(newProjectActions.removeInvalidFields(["step2"]))
        : dispatch(editProjectActions.removeInvalidFields(["step2"]));
    } else {
      !editMode
        ? dispatch(newProjectActions.setInvalidField(["step2"]))
        : dispatch(editProjectActions.setInvalidField(["step2"]));
    }
  }, [
    fields.title,
    fields.shortDescription,
    fields.goal,
    fields.minimumContribution,
    dispatch,
    editMode,
  ]);

  return (
    <Wrapper>
      <TextField
        label="Campaign Title*"
        placeholder="Write a title"
        value={fields.title}
        onChange={(event) => {
          if (!event.target.value)
            setErrors((prev: any) => ({ ...prev, title: true }));
          else setErrors((prev: any) => ({ ...prev, title: false }));
          updateField("title", event.target.value);
        }}
        error={errors.title}
        errorLabel={"Field should not be empty."}
      />
      <MultilineTextField
        label="Short Description*"
        placeholder="Write a short description..."
        rows={3}
        value={fields.shortDescription}
        onChange={(event) => {
          if (!event.target.value)
            setErrors((prev: any) => ({ ...prev, shortDescription: true }));
          else setErrors((prev: any) => ({ ...prev, shortDescription: false }));
          updateField("shortDescription", event.target.value);
        }}
        error={errors.shortDescription}
        errorLabel={"Field should not be empty."}
      />
      <Row>
        <TextField
          type="number"
          label="Goal*"
          disabled={editMode}
          icon={<EthereumIcon size={20} />}
          placeholder="0.00"
          value={fields.goal?.toString() || ""}
          onChange={(event) => {
            if (!event.target.value)
              setErrors((prev: any) => ({ ...prev, goal: true }));
            else setErrors((prev: any) => ({ ...prev, goal: false }));
            updateField("goal", event.target.value);
          }}
          error={errors.goal}
          errorLabel={"Field should not be empty."}
        />
        <TextField
          disabled={editMode}
          type="number"
          label="Minimum Contribution*"
          icon={<EthereumIcon size={20} />}
          placeholder="0.00"
          value={fields.minimumContribution?.toString() || ""}
          onChange={(event) => {
            if (!event.target.value)
              setErrors((prev: any) => ({
                ...prev,
                minimumContribution: true,
              }));
            else
              setErrors((prev: any) => ({
                ...prev,
                minimumContribution: false,
              }));
            updateField("minimumContribution", event.target.value);
          }}
          error={errors.minimumContribution}
          errorLabel={"Field should not be empty."}
        />
      </Row>
      <Row>
        <DatePicker
          disabled={editMode}
          label="End Date*"
          value={fields.endDate}
          onChange={(value) => updateField("endDate", value)}
        />
      </Row>
    </Wrapper>
  );
};

export default Step2;

const Wrapper = styled(Card, {
  display: "flex",
  flexDirection: "column",
  gap: 30,
  width: "100%",
});

const Row = styled("div", {
  display: "flex",
  gap: 30,
});
