import React, { useState } from "react";
import Button from "../../../components/common/Button";
import MultilineTextField from "../../../components/common/MultilineTextField";
import TextField from "../../../components/common/TextField";
import { selectUserProfile, userSliceActions } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const AddressModalContent = ({ closeModal }: { closeModal: () => any }) => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);

  const [country, setCountry] = useState(profile.address?.country || "");
  const [residence, setResidence] = useState(profile.address?.residence || "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <TextField
        label="Country"
        placeholder="USA"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
      />
      <MultilineTextField
        label="Add Address"
        placeholder="City, Street, etc..."
        value={residence}
        onChange={(event) => setResidence(event.target.value)}
      />
      <Button
        color="green400"
        onClick={() => {
          closeModal();
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default AddressModalContent;
