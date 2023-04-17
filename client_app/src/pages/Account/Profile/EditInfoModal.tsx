import React, { useState } from "react";
import Button from "../../../components/common/Button";
import MultilineTextField from "../../../components/common/MultilineTextField";
import TextField from "../../../components/common/TextField";
import { selectUserProfile, userSliceActions } from "../../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const EditInfoModal = ({ closeModal }: { closeModal: () => any }) => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [description, setDescription] = useState(profile.description);
  const [country, setCountry] = useState(profile.address?.country || "");
  const [residence, setResidence] = useState(profile.address?.residence || "");
  const [phone, setPhone] = useState(profile.phone || "");

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <TextField
          label="Name"
          placeholder="John"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          label="Surname"
          placeholder="John"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        {/*   <MultilineTextField
          label="Description"
          placeholder="Describe your causes, your motives...."
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
        /> */}
        <TextField
          label="Phone"
          placeholder="+407...."
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
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
            dispatch(
              userSliceActions.updateUserInfo(
                firstName,
                lastName,
                description,
                country,
                residence,
                phone
              )
            );
            closeModal();
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default EditInfoModal;
