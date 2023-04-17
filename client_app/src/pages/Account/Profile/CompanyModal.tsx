import React, { useState } from "react";
import Button from "../../../components/common/Button";
import MultilineTextField from "../../../components/common/MultilineTextField";
import TextField from "../../../components/common/TextField";
import { selectUserProfile, userSliceActions } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const CompanyModal = ({ closeModal }: { closeModal: () => any }) => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);

  const [companyName, setCompanyName] = useState(profile.companyName);
  const [companyEmail, setCompanyEmail] = useState(profile.companyEmail);
  const [description, setDescription] = useState(profile.companyDescription);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <TextField
        label="Company Name"
        value={companyName}
        onChange={(event) => setCompanyName(event.currentTarget.value)}
      />
      <TextField
        label="Company Email"
        value={companyEmail}
        onChange={(event) => setCompanyEmail(event.currentTarget.value)}
      />
      <MultilineTextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <Button
        color="green400"
        onClick={() => {
          dispatch(
            userSliceActions.updateCompanyProfile(
              true,
              companyName,
              companyEmail,
              description
            )
          );
          closeModal();
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default CompanyModal;
