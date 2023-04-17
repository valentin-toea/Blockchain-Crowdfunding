import { Tooltip } from "@mantine/core";
import React, { useState } from "react";
import { selectNewProject } from "../../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import WalletCard from "../../Account/Profile/WalletCard";
import { InfoCircle as InfoIcon } from "@styled-icons/boxicons-solid/InfoCircle";
import { theme } from "../../../theme";
import Card from "../../../components/Card";
import { selectUserProfile, userSliceActions } from "../../../slices/userSlice";
import Avatar from "../../../components/common/Avatar";
import Switch from "../../../components/common/Switch";
import Modal from "../../../components/common/Modal";
import CompanyModal from "../../Account/Profile/CompanyModal";

const WalletStep = () => {
  const profile = useAppSelector(selectUserProfile);
  const dispatch = useAppDispatch();
  const [companyModal, setCompanyModal] = useState(false);

  return (
    <div style={{ display: "flex", gap: 50 }}>
      <div>
        <h3>Profile</h3>
        <Card>
          <div style={{ marginBottom: 20 }}>
            <p>This is what users will see as the creator of the campaign.</p>
            {!profile.hasCompany && (
              <h5>*You currently don't have a company profile on.</h5>
            )}
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <h5 style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <p style={{ fontSize: 15 }}>
                  {profile.hasCompany
                    ? "Switch to User Profile"
                    : "Switch to Company Profile"}
                </p>
                <Tooltip
                  withArrow
                  wrapLines
                  width={340}
                  styles={{
                    root: {
                      color: "black",
                    },
                    body: {
                      background: "#E8E9EB",
                      borderRadius: 10,
                      boxShadow: theme.shadows.boxShadow3.toString(),
                    },
                    arrow: {
                      background: "#E8E9EB",
                    },
                  }}
                  position="bottom"
                  label={
                    <div style={{ padding: 20, fontWeight: "400" }}>
                      <p style={{ color: "black" }}>
                        This change will affect all campaigns.
                      </p>
                    </div>
                  }
                >
                  <InfoIcon
                    size={25}
                    style={{ color: theme.colors.neutral100.toString() }}
                  />
                </Tooltip>
              </h5>
              <Switch
                checked={profile.hasCompany}
                onChange={(value) => {
                  if (value) setCompanyModal(true);
                  else dispatch(userSliceActions.setHasCompany(value));
                }}
              />
            </div>
          </div>

          {!profile.hasCompany && (
            <div>
              <div style={{ display: "flex", gap: 10 }}>
                <Avatar
                  large
                  fallbackText={
                    profile.firstName[0] + profile.lastName[0] || ""
                  }
                />
                <div
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <span style={{ fontWeight: "bold", fontSize: 18 }}>
                    {profile.firstName + " " + profile.lastName}
                  </span>
                  <span>{profile.email}</span>
                </div>
              </div>
              <div style={{ marginTop: 20, fontStyle: "italic" }}>
                {profile.description || "No description"}
              </div>
            </div>
          )}
          {profile.hasCompany && (
            <>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <Avatar
                  large
                  fallbackText={profile.companyName && profile.companyName[0]}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: 18 }}>
                    {profile.companyName || "No Name"}
                  </span>
                  <span>{profile.companyEmail || "No Email"}</span>
                </div>
              </div>
              <div style={{ marginTop: 20, fontStyle: "italic" }}>
                {profile.companyDescription || "No description"}
              </div>
            </>
          )}

          <Modal
            title="Set Company"
            open={companyModal}
            onOpenChange={setCompanyModal}
          >
            <CompanyModal closeModal={() => setCompanyModal(false)} />
          </Modal>
        </Card>
      </div>
      <div>
        <div style={{ display: "flex", gap: 10 }}>
          <h3>Where to receive the funds</h3>
          <Tooltip
            withArrow
            wrapLines
            width={340}
            styles={{
              root: {
                color: "black",
              },
              body: {
                background: "#E8E9EB",
                borderRadius: 10,
                boxShadow: theme.shadows.boxShadow3.toString(),
              },
              arrow: {
                background: "#E8E9EB",
              },
            }}
            position="bottom"
            label={
              <div style={{ padding: 20, fontWeight: "400" }}>
                <p style={{ color: "black" }}>
                  The wallet is taken from your account.
                </p>
                <p style={{ color: "black" }}>
                  You can connect another wallet.
                </p>
                <p style={{ color: "black" }}>
                  *Once the project has been deployed you will not be able to
                  change this.
                </p>
              </div>
            }
          >
            <InfoIcon
              size={25}
              style={{ color: theme.colors.neutral100.toString() }}
            />
          </Tooltip>
        </div>
        <div style={{ maxWidth: 400 }}>
          <WalletCard />
        </div>
      </div>
    </div>
  );
};

export default WalletStep;
